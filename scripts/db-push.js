// Import required modules
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Get database connection string from environment variable
const connectionString = process.env.DATABASE_URL;

// Function to initialize the database
async function initializeDatabase() {
  // Connect to PostgreSQL
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Starting schema creation...');
    
    // Create enum types
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
          CREATE TYPE role AS ENUM ('employee', 'management', 'client', 'admin');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'department') THEN
          CREATE TYPE department AS ENUM ('Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Executive');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
          CREATE TYPE document_type AS ENUM ('PDF', 'DOCX', 'XLSX', 'PPTX', 'TXT', 'CSV', 'PNG', 'JPG', 'Other');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'theme') THEN
          CREATE TYPE theme AS ENUM ('light', 'dark', 'system');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
          CREATE TYPE notification_type AS ENUM ('email', 'in_app', 'both', 'none');
        END IF;
      END
      $$;
    `);
    
    console.log('Enum types created successfully.');
    
    // Create tables with proper casting
    await client.query(`
      -- Users table
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
      
      -- Documents table
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
      
      -- Announcements table
      CREATE TABLE IF NOT EXISTS "announcements" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "department" department,
        "author_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "is_important" BOOLEAN DEFAULT false
      );
      
      -- Events table
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
      
      -- User Settings table
      CREATE TABLE IF NOT EXISTS "user_settings" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL UNIQUE,
        "theme" theme DEFAULT 'system'::theme NOT NULL,
        "notifications" notification_type DEFAULT 'in_app'::notification_type NOT NULL,
        "email_digest" BOOLEAN DEFAULT true,
        "dashboard_layout" JSONB,
        "last_updated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
      
      -- User Profiles table
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
    
    console.log('Tables created successfully.');
    
    // Create default admin user
    const adminExists = await client.query(
      "SELECT * FROM users WHERE role = 'admin'::role LIMIT 1"
    );
    
    if (adminExists.rows.length === 0) {
      await client.query(`
        INSERT INTO users (username, password, email, full_name, title, department, role)
        VALUES ('admin', '$2b$10$9scJR99fQOk2HNBMgnVcoO7Hh8yw8hvR4qchYY90HrH7ECd2UFLt.', 'admin@company.com', 'Admin User', 'System Administrator', 'Engineering'::department, 'admin'::role)
      `);
      
      console.log('Default admin user created successfully!');
    } else {
      console.log('Admin user already exists, skipping creation.');
    }
    
    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });