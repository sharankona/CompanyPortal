import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { fileURLToPath } from 'url';
import path from 'path';

// Read PostgreSQL connection string from environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('No DATABASE_URL environment variable found');
  process.exit(1);
}

async function main() {
  console.log('Connecting to database...');
  
  // Initialize postgres client
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);
  
  console.log('Creating tables from schema...');
  
  try {
    // Push the schema to database
    await db.execute(`
      CREATE TYPE IF NOT EXISTS "role" AS ENUM ('employee', 'management', 'client', 'admin');
      CREATE TYPE IF NOT EXISTS "department" AS ENUM ('Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Executive');
      CREATE TYPE IF NOT EXISTS "document_type" AS ENUM ('PDF', 'DOCX', 'XLSX', 'PPTX', 'TXT', 'CSV', 'PNG', 'JPG', 'Other');
      CREATE TYPE IF NOT EXISTS "theme" AS ENUM ('light', 'dark', 'system');
      CREATE TYPE IF NOT EXISTS "notification_type" AS ENUM ('email', 'in_app', 'both', 'none');
      
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "full_name" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "department" department NOT NULL,
        "phone_number" TEXT,
        "profile_image" TEXT,
        "role" role NOT NULL DEFAULT 'employee'::role
      );
      
      CREATE TABLE IF NOT EXISTS "documents" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "type" document_type NOT NULL,
        "file_url" TEXT NOT NULL,
        "description" TEXT,
        "uploaded_by_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "access_level" role NOT NULL DEFAULT 'employee'::role
      );
      
      CREATE TABLE IF NOT EXISTS "announcements" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "department" department,
        "author_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "is_important" BOOLEAN DEFAULT false
      );
      
      CREATE TABLE IF NOT EXISTS "events" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "location" TEXT,
        "organizer_id" INTEGER NOT NULL,
        "department" department
      );
      
      CREATE TABLE IF NOT EXISTS "user_settings" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL UNIQUE,
        "theme" theme DEFAULT 'system'::theme NOT NULL,
        "notifications" notification_type DEFAULT 'in_app'::notification_type NOT NULL,
        "email_digest" BOOLEAN DEFAULT true,
        "dashboard_layout" JSONB,
        "last_updated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "user_profiles" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL UNIQUE,
        "bio" TEXT,
        "location" TEXT,
        "skills" TEXT[],
        "languages" TEXT[],
        "social_links" JSONB,
        "availability" TEXT,
        "last_updated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    
    console.log('Schema migration completed successfully');
  } catch (error) {
    console.error('Migration failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();