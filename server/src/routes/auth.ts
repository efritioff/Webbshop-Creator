import { Hono } from "hono";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "../db/client";
import jwt from "jsonwebtoken";

const auth = new Hono();

export const registerSchema = z.object({
  email: z.email("Email must be a valid email adress"),
  password: z
    .string()
    .min(6, "Password must be atleast 6 characters")
    .max(20, "Password can't be more than 20 characters"),
});

export const loginSchema = z.object({
  email: z.email("Email must be a valid email adress"),
  password: z
    .string()
    .min(6, "Password must be atleast 6 characters")
    .max(20, "Password can't be more than 20 characters"),
});

auth.post("/register", async (c) => {
  const body = await c.req.json();
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: result.error.errors }, 400);
  }
  const existingUser = await db
    .collection("users")
    .findOne({ email: result.data.email });

  if (existingUser) {
    return c.json({ error: "Email already exists" }, 400);
  }
  const hashedPassword = await bcrypt.hash(result.data.password, 10);
  await db.collection("users").insertOne({
    email: result.data.email,
    password: hashedPassword,
    createdAt: new Date(),
  });
  return c.json({ message: "User created" }, 201);
});

auth.post("/login", async (c) => {
  const body = await c.req.json();
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: result.error.errors }, 400);
  }

  const user = await db
    .collection("users")
    .findOne({ email: result.data.email });

  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const validPassword = await bcrypt.compare(
    result.data.password,
    user.password,
  );
  if (!validPassword) {
    return c.json({ error: "invalid credentials" }, 401);
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" },
  );

  c.header(
    "Set-Cookie",
    `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
  );
  return c.json({ token }, 200);
});

auth.post("/refresh", async (c) => {
  const cookie = c.req.header("cookie");
  const refreshToken = cookie?.split("refreshToken=")[1]?.split(";")[0];

  if (!refreshToken) {
    return c.json({ error: "No refresh token" }, 401);
  }

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
    userId: string;
  };
  const newToken = jwt.sign(
    { userId: payload.userId },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  return c.json({ token: newToken }, 200);
});

export default auth;
