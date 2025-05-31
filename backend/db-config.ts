import { drizzle } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import Database from "better-sqlite3";
import postgres from "postgres";
import * as schema from "../shared/schema";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

let db;

if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
  // Use PostgreSQL for production (Vercel)
  console.log("Using PostgreSQL database");
  const sql = postgres(process.env.DATABASE_URL);
  db = drizzlePg(sql, { schema: schema });
} else {
  // Use SQLite for development
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const sqlitePath = process.env.SQLITE_DATABASE_PATH || "data/app.db";
  console.log("Using SQLite database");
  const sqlite = new Database(sqlitePath);
  db = drizzle(sqlite, { schema });
}

export { db };