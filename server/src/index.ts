import { Hono } from "hono";
import { connectDB } from "./db/client";
import auth from "./routes/auth"

const app = new Hono();
app.route("/api/auth", auth)


app.get("/", (c) => c.text("Server igång"));

await connectDB();

export default {
  port: 3000,
  fetch: app.fetch,
};