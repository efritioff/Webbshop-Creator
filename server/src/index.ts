import { Hono } from "hono";
import { connectDB } from "./db/client";

const app = new Hono();

app.get("/", (c) => c.text("Server igång"));

await connectDB();

export default {
  port: 3000,
  fetch: app.fetch,
};