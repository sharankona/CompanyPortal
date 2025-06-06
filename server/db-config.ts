import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../shared/schema";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Configure SQLite database
const sqlitePath = process.env.SQLITE_DATABASE_PATH || "data/app.db";
console.log("Using SQLite database");

// Create the database instance
const sqlite = new Database(sqlitePath);
const db = drizzle(sqlite, { schema });

export { db };