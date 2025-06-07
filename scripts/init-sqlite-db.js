// Initialize SQLite database with required tables and initial data
const Database = require('better-sqlite3');
const { fileURLToPath } = require('url');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Connect to the database (or create if it doesn't exist)
const dbPath = path.join(dataDir, 'app.db');
console.log(`Initializing SQLite database at: ${dbPath}`);
const db = new Database(dbPath);

// Enable foreign keys constraint
db.pragma('foreign_keys = ON');

async function initializeDatabase() {
  try {
    // Create tables

    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "user" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        email TEXT NOT NULL,
        full_name TEXT,
        first_name TEXT,
        last_name TEXT,
        title TEXT,
        department TEXT,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER,
        last_login INTEGER,
        role INTEGER NOT NULL
      );
    `);

    // Roles table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "role" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      );
    `);

    // User-role many-to-many relationship table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "user_roles" (
        user_id INTEGER NOT NULL,
        role_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES "role" (id) ON DELETE CASCADE
      );
    `);

    // Documents table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "document" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        file_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        uploaded_by INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (uploaded_by) REFERENCES "user" (id) ON DELETE CASCADE
      );
    `);

    // Announcements table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "announcement" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_active INTEGER,
        priority INTEGER,
        created_at INTEGER,
        updated_at INTEGER,
        start_date INTEGER,
        end_date INTEGER,
        author_id INTEGER NOT NULL,
        FOREIGN KEY (author_id) REFERENCES "user" (id) ON DELETE CASCADE
      );
    `);

    // Tags table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "tag" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      );
    `);

    // Document-tag many-to-many relationship table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "document_tags" (
        document_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (document_id, tag_id),
        FOREIGN KEY (document_id) REFERENCES "document" (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES "tag" (id) ON DELETE CASCADE
      );
    `);

    // Events table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "event" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        start_date INTEGER NOT NULL,
        end_date INTEGER NOT NULL,
        location TEXT,
        organizer_id INTEGER NOT NULL
      );
    `);

    // User settings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "user_settings" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        theme TEXT NOT NULL,
        notifications TEXT NOT NULL,
        email_digest INTEGER DEFAULT 1,
        last_updated INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
      );
    `);

    // User profile table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "user_profile" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        bio TEXT,
        location TEXT,
        last_updated INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
      );
    `);

    // Insert initial data if tables are empty

    // Insert roles if they don't exist
    const existingRoles = db.prepare('SELECT COUNT(*) as count FROM "role"').get();
    if (existingRoles.count === 0) {
      const insertRole = db.prepare('INSERT INTO "role" (name, description) VALUES (?, ?)');
      insertRole.run('employee', 'Regular employee with basic access');
      insertRole.run('manager', 'Department manager with intermediate access');
      insertRole.run('admin', 'Administrator with full access');
      console.log('Added default roles');
    }

    // Insert admin user if no users exist
    const existingUsers = db.prepare('SELECT COUNT(*) as count FROM "user"').get();
    if (existingUsers.count === 0) {
      // Hash the password
      const saltRounds = 10;
      const plainPassword = 'admin123';
      const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds);
      
      // Current timestamp in seconds
      const now = Math.floor(Date.now() / 1000);
      
      // Insert admin user
      const insertUser = db.prepare(
        'INSERT INTO "user" (username, password_hash, email, full_name, department, title, is_active, created_at, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      
      insertUser.run(
        'admin',
        hashedPassword,
        'admin@example.com',
        'System Administrator',
        'IT',
        'Administrator',
        1, // is_active = true
        now,
        3  // role_id = 3 (admin)
      );
      
      console.log('Added default admin user (username: admin, password: admin123)');
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the database connection
    db.close();
  }
}

// Run the database initialization
initializeDatabase();