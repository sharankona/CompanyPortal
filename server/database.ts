import { db } from "./db";
import { 
  users, type User, type InsertUser,
  documents, type Document, type InsertDocument,
  announcements, type Announcement, type InsertAnnouncement,
  events, type Event, type InsertEvent,
  userSettings, type UserSettings, type InsertUserSettings,
  userProfiles, type UserProfile, type InsertUserProfile
} from "@shared/schema";
import { IStorage } from "./storage";
import { eq, desc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUsers(filters?: Partial<User>): Promise<User[]> {
    if (!filters) {
      return await db.select().from(users);
    }
    
    const { id, username, email, department, role } = filters;
    let query = db.select().from(users);
    
    if (id !== undefined) query = query.where(eq(users.id, id));
    if (username !== undefined) query = query.where(eq(users.username, username));
    if (email !== undefined) query = query.where(eq(users.email, email));
    if (department !== undefined) query = query.where(eq(users.department, department));
    if (role !== undefined) query = query.where(eq(users.role, role));
    
    return await query;
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async getDocuments(filters?: Partial<Document>): Promise<Document[]> {
    if (!filters) {
      return await db.select().from(documents).orderBy(desc(documents.createdAt));
    }
    
    const { id, name, type, uploadedById, accessLevel } = filters;
    let query = db.select().from(documents).orderBy(desc(documents.createdAt));
    
    if (id !== undefined) query = query.where(eq(documents.id, id));
    if (name !== undefined) query = query.where(eq(documents.name, name));
    if (type !== undefined) query = query.where(eq(documents.type, type));
    if (uploadedById !== undefined) query = query.where(eq(documents.uploadedById, uploadedById));
    if (accessLevel !== undefined) query = query.where(eq(documents.accessLevel, accessLevel));
    
    return await query;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db
      .delete(documents)
      .where(eq(documents.id, id))
      .returning();
    return result.length > 0;
  }

  // Announcement operations
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement || undefined;
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values(insertAnnouncement)
      .returning();
    return announcement;
  }

  async getAnnouncements(filters?: Partial<Announcement>): Promise<Announcement[]> {
    if (!filters) {
      return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    }
    
    const { id, title, authorId, department, isImportant } = filters;
    let query = db.select().from(announcements).orderBy(desc(announcements.createdAt));
    
    if (id !== undefined) query = query.where(eq(announcements.id, id));
    if (title !== undefined) query = query.where(eq(announcements.title, title));
    if (authorId !== undefined) query = query.where(eq(announcements.authorId, authorId));
    if (department !== undefined) query = query.where(eq(announcements.department, department));
    if (isImportant !== undefined) query = query.where(eq(announcements.isImportant, isImportant));
    
    return await query;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db
      .delete(announcements)
      .where(eq(announcements.id, id))
      .returning();
    return result.length > 0;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async getEvents(filters?: Partial<Event>): Promise<Event[]> {
    if (!filters) {
      return await db.select().from(events).orderBy(events.startDate);
    }
    
    const { id, title, organizerId, department } = filters;
    let query = db.select().from(events).orderBy(events.startDate);
    
    if (id !== undefined) query = query.where(eq(events.id, id));
    if (title !== undefined) query = query.where(eq(events.title, title));
    if (organizerId !== undefined) query = query.where(eq(events.organizerId, organizerId));
    if (department !== undefined) query = query.where(eq(events.department, department));
    
    return await query;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning();
    return result.length > 0;
  }

  async updateEvent(id: number, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set(eventUpdate)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent || undefined;
  }

  // User Settings operations
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings || undefined;
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const [settings] = await db
      .insert(userSettings)
      .values(insertSettings)
      .returning();
    return settings;
  }

  async updateUserSettings(userId: number, settingsUpdate: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const [updatedSettings] = await db
      .update(userSettings)
      .set({ ...settingsUpdate, lastUpdated: new Date() })
      .where(eq(userSettings.userId, userId))
      .returning();
    return updatedSettings || undefined;
  }

  // User Profile operations
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateUserProfile(userId: number, profileUpdate: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ ...profileUpdate, lastUpdated: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile || undefined;
  }
}

  // Financial operations
  async getFinancialMetrics(period?: string): Promise<typeof financialMetrics.$inferSelect[]> {
    let query = db.select().from(financialMetrics);
    if (period) query = query.where(eq(financialMetrics.period, period));
    return await query.orderBy(desc(financialMetrics.createdAt));
  }

  async getExpenses(filters?: { category?: string; startDate?: string; endDate?: string }): Promise<typeof expenses.$inferSelect[]> {
    let query = db.select().from(expenses);
    if (filters?.category) query = query.where(eq(expenses.category, filters.category));
    return await query.orderBy(desc(expenses.date));
  }

  async getRevenue(filters?: { source?: string; startDate?: string; endDate?: string }): Promise<typeof revenue.$inferSelect[]> {
    let query = db.select().from(revenue);
    if (filters?.source) query = query.where(eq(revenue.source, filters.source));
    return await query.orderBy(desc(revenue.date));
  }
