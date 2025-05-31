import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./backend/shared/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "./data/app.db",
  },
});