import {
  users,
  documents,
  announcements,
  activities,
  type User,
  type Document,
  type Announcement,
  type Activity,
  type InsertUser,
  type InsertDocument,
  type InsertAnnouncement,
  type InsertActivity,
} from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectSqlite3 from 'connect-sqlite3';

// Create SQLiteStore using ES module syntax
const SQLiteStore = connectSqlite3(session);

// Define the IStorage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(filters?: Partial<User>): Promise<User[]>;

  // Document methods
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined>;
  getDocuments(): Promise<Document[]>;

  // Announcement methods
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getAnnouncements(): Promise<Announcement[]>;

  // Activity methods
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivities(limit?: number): Promise<Activity[]>;

  // Session store
  sessionStore: session.SessionStore;
}

// Configure session storage
const sessionStore = new SQLiteStore({
  db: "app.db",
  dir: "./data",
  table: "sessions",
});

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = sessionStore;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length ? results[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async getUsers(filters?: Partial<User>): Promise<User[]> {
    return await db.select().from(users);
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<void> {
    try {
      console.log(`Storage: Attempting to delete user with ID ${id}`);
      
      // First fetch the user to make sure it exists
      const user = await this.getUser(id);
      if (!user) {
        console.log(`Storage: User with ID ${id} not found`);
        throw new Error("User not found");
      }
      
      // Delete the user from the database
      console.log(`Storage: Deleting user with ID ${id} from database`);
      
      // Execute the delete operation and get result
      await db.delete(users).where(eq(users.id, id));
      
      // Log success
      console.log(`Storage: User with ID ${id} successfully deleted from database`);
    } catch (error) {
      // Enhanced error logging
      console.error(`Storage: Error deleting user with ID ${id}:`, error);
      if (error instanceof Error) {
        console.error(`Storage: Error message: ${error.message}`);
        console.error(`Storage: Error stack: ${error.stack}`);
      }
      throw error;
    }
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async updateDocument(id: number, documentUpdate: Partial<Document>): Promise<Document | undefined> {
    const [updatedDocument] = await db
      .update(documents)
      .set(documentUpdate)
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents);
  }

  // Announcement operations
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values(insertAnnouncement)
      .returning();
    return announcement;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements);
  }

  // Activity operations
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    return await db.select().from(activities).limit(limit);
  }
}

// Export storage instance
export const storage = new DatabaseStorage();