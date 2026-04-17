import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

const client = new MongoClient(uri);

export const db = client.db("webbshop-creator");

export async function connectDB() {
  await client.connect();
  console.log("Ansluten till MongoDB");
}