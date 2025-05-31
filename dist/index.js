var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activities: () => activities,
  announcements: () => announcements,
  budget: () => budget,
  contentHistory: () => contentHistory,
  contentItems: () => contentItems,
  contentWorkflows: () => contentWorkflows,
  defineContentPipelineRoutes: () => defineContentPipelineRoutes,
  documents: () => documents,
  expenses: () => expenses,
  financialMetrics: () => financialMetrics,
  insertActivitySchema: () => insertActivitySchema,
  insertAnnouncementSchema: () => insertAnnouncementSchema,
  insertDocumentSchema: () => insertDocumentSchema,
  insertUserSchema: () => insertUserSchema,
  invoices: () => invoices,
  revenue: () => revenue,
  users: () => users
});
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
  // admin, user
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  // draft, review, published
  createdById: integer("created_by_id").notNull(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: text("updated_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var announcements = sqliteTable("announcements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  // company, important, hr
  createdById: integer("created_by_id").notNull(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  // document_created, document_modified, user_joined, etc.
  description: text("description").notNull(),
  userId: integer("user_id").notNull(),
  documentId: integer("document_id"),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var contentItems = sqliteTable("content_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(),
  // blog, social, product
  status: text("status").notNull().default("draft"),
  // draft, review, approved, scheduled, published
  assignedTo: integer("assigned_to"),
  deadline: text("deadline"),
  createdBy: integer("created_by").notNull(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: text("updated_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var contentWorkflows = sqliteTable("content_workflows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contentType: text("content_type").notNull(),
  // blog, social, product
  steps: text("steps").notNull(),
  // JSON string of workflow steps
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: text("updated_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var contentHistory = sqliteTable("content_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contentId: integer("content_id").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var revenue = sqliteTable("revenue", {
  id: integer("id").primaryKey(),
  source: text("source").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  description: text("description")
});
var expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey(),
  category: text("category").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  description: text("description")
});
var invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull(),
  clientName: text("client_name").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  // paid, pending, overdue
  dueDate: text("due_date").notNull(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var budget = sqliteTable("budget", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  plannedAmount: integer("planned_amount").notNull(),
  actualAmount: integer("actual_amount").default(0),
  period: text("period").notNull(),
  // monthly, quarterly, yearly
  year: integer("year").notNull(),
  month: integer("month"),
  // 1-12 for monthly
  quarter: integer("quarter"),
  // 1-4 for quarterly
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var financialMetrics = sqliteTable("financial_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  value: integer("value").notNull(),
  description: text("description"),
  period: text("period").notNull(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true
});
var insertDocumentSchema = z.object({
  name: z.string(),
  contentType: z.string(),
  size: z.number(),
  createdById: z.number()
});
var insertAnnouncementSchema = z.object({
  title: z.string(),
  content: z.string(),
  createdById: z.number()
});
var insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  description: true,
  userId: true,
  documentId: true
});
var isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (token !== "valid-token") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
function defineContentPipelineRoutes(app2) {
  app2.get("/api/content", isAuthenticated, async (req, res, next) => {
    try {
      const contentItems2 = [
        { id: 1, title: "Sample Content 1" },
        { id: 2, title: "Sample Content 2" }
      ];
      res.json(contentItems2);
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/content", isAuthenticated, async (req, res, next) => {
    try {
      const newContent = { id: 3, title: req.body.title };
      res.status(201).json(newContent);
    } catch (error) {
      next(error);
    }
  });
  app2.put("/api/content/:id", isAuthenticated, async (req, res, next) => {
    try {
      const updatedContent = { id: req.params.id, title: req.body.title };
      res.json(updatedContent);
    } catch (error) {
      next(error);
    }
  });
  app2.delete("/api/content/:id", isAuthenticated, async (req, res, next) => {
    try {
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
}

// server/storage.ts
import session from "express-session";

// server/db-config.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();
var dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
var sqlitePath = process.env.SQLITE_DATABASE_PATH || "data/app.db";
console.log("Using SQLite database");
var sqlite = new Database(sqlitePath);
var db = drizzle(sqlite, { schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
import connectSqlite3 from "connect-sqlite3";
var SQLiteStore = connectSqlite3(session);
var sessionStore = new SQLiteStore({
  db: "app.db",
  dir: "./data",
  table: "sessions"
});
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = sessionStore;
  }
  // User operations
  async getUser(id) {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length ? results[0] : void 0;
  }
  async getUserByUsername(username) {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length ? results[0] : void 0;
  }
  async createUser(user) {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }
  async getUsers(filters) {
    return await db.select().from(users);
  }
  async updateUser(id, data) {
    const [updatedUser] = await db.update(users).set({ ...data, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }).where(eq(users.id, id)).returning();
    return updatedUser;
  }
  async deleteUser(id) {
    try {
      console.log(`Storage: Attempting to delete user with ID ${id}`);
      const user = await this.getUser(id);
      if (!user) {
        console.log(`Storage: User with ID ${id} not found`);
        throw new Error("User not found");
      }
      console.log(`Storage: Deleting user with ID ${id} from database`);
      await db.delete(users).where(eq(users.id, id));
      console.log(`Storage: User with ID ${id} successfully deleted from database`);
    } catch (error) {
      console.error(`Storage: Error deleting user with ID ${id}:`, error);
      if (error instanceof Error) {
        console.error(`Storage: Error message: ${error.message}`);
        console.error(`Storage: Error stack: ${error.stack}`);
      }
      throw error;
    }
  }
  // Document operations
  async getDocument(id) {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }
  async createDocument(insertDocument) {
    const [document] = await db.insert(documents).values(insertDocument).returning();
    return document;
  }
  async updateDocument(id, documentUpdate) {
    const [updatedDocument] = await db.update(documents).set(documentUpdate).where(eq(documents.id, id)).returning();
    return updatedDocument;
  }
  async getDocuments() {
    return await db.select().from(documents);
  }
  // Announcement operations
  async getAnnouncement(id) {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }
  async createAnnouncement(insertAnnouncement) {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }
  async getAnnouncements() {
    return await db.select().from(announcements);
  }
  // Activity operations
  async createActivity(insertActivity) {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }
  async getActivities(limit = 10) {
    return await db.select().from(activities).limit(limit);
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { z as z2 } from "zod";
import { ValidationError } from "zod-validation-error";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
var registerSchema = insertUserSchema.extend({
  password: z2.string().min(6, "Password must be at least 6 characters"),
  username: z2.string().min(3, "Username must be at least 3 characters"),
  fullName: z2.string().min(2, "Full name is required")
});
function setupAuth(app2) {
  const sessionSecret = process.env.SESSION_SECRET || "dev-secret-key-change-in-production";
  const sessionSettings = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24,
      // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  };
  if (process.env.NODE_ENV === "production") {
    app2.set("trust proxy", 1);
  }
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser({
        ...validatedData,
        password: await hashPassword(validatedData.password)
      });
      const { password, ...userWithoutPassword } = user;
      req.login(user, (err) => {
        if (err) return next(err);
        storage.createActivity({
          type: "user_joined",
          description: `${user.fullName} joined the company`,
          userId: user.id
        });
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        const validationError = new ValidationError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// server/routes.ts
import { z as z3 } from "zod";
import { ValidationError as ValidationError2 } from "zod-validation-error";
import { desc, eq as eq2 } from "drizzle-orm";
function isAuthenticated2(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  res.status(403).json({ message: "Forbidden - Admin access required" });
}
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, fullName, role } = req.body;
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser({
        username,
        password,
        // Note: In a production app, you should hash this password
        fullName,
        role: role || "user"
      });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/users", isAuthenticated2, async (req, res, next) => {
    try {
      const users2 = await storage.getUsers();
      const usersWithoutPasswords = users2.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      next(error);
    }
  });
  app2.patch("/api/users/:id", isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      if (!role || !["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (req.user.id === userId && role !== "admin") {
        return res.status(403).json({ message: "Cannot change your own admin role" });
      }
      const updatedUser = await storage.updateUser(userId, { role });
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  app2.delete("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      console.log(`Delete request for user ID: ${userId} by admin ID: ${req.user.id}`);
      if (isNaN(userId)) {
        console.log(`Invalid user ID: ${req.params.id}`);
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        console.log(`User not found: ${userId}`);
        return res.status(404).json({ message: "User not found" });
      }
      if (req.user.id === userId) {
        console.log(`Admin attempted to delete own account: ${userId}`);
        return res.status(403).json({ message: "Cannot delete your own account" });
      }
      console.log(`Proceeding to delete user ${userId}`);
      await storage.deleteUser(userId);
      console.log(`User ${userId} deleted successfully by admin ${req.user.id}`);
      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error in delete user route:", errorMessage, error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete user",
        error: errorMessage
      });
    }
  });
  app2.get("/api/documents", isAuthenticated2, async (req, res, next) => {
    try {
      const documents2 = await storage.getDocuments();
      res.json(documents2);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/documents/:id", isAuthenticated2, async (req, res, next) => {
    try {
      const document = await storage.getDocument(parseInt(req.params.id));
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/documents", isAuthenticated2, async (req, res, next) => {
    try {
      const validatedData = insertDocumentSchema.parse({
        ...req.body,
        createdById: req.user.id
      });
      const document = await storage.createDocument(validatedData);
      await storage.createActivity({
        type: "document_created",
        description: `${req.user.fullName} created document "${document.name}"`,
        userId: req.user.id,
        documentId: document.id
      });
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        const validationError = new ValidationError2(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });
  app2.patch("/api/documents/:id", isAuthenticated2, async (req, res, next) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      const updatedDocument = await storage.updateDocument(documentId, req.body);
      await storage.createActivity({
        type: "document_modified",
        description: `${req.user.fullName} modified document "${document.name}"`,
        userId: req.user.id,
        documentId: document.id
      });
      res.json(updatedDocument);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/announcements", isAuthenticated2, async (req, res, next) => {
    try {
      const announcements2 = await storage.getAnnouncements();
      res.json(announcements2);
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/announcements", isAuthenticated2, async (req, res, next) => {
    try {
      const validatedData = insertAnnouncementSchema.parse({
        ...req.body,
        createdById: req.user.id
      });
      const announcement = await storage.createAnnouncement(validatedData);
      await storage.createActivity({
        type: "announcement_created",
        description: `${req.user.fullName} created announcement "${announcement.title}"`,
        userId: req.user.id
      });
      res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        const validationError = new ValidationError2(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });
  app2.get("/api/activities", isAuthenticated2, async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const activities2 = await storage.getActivities(limit);
      res.json(activities2);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/dashboard/stats", isAuthenticated2, async (req, res, next) => {
    try {
      const documents2 = await storage.getDocuments();
      const users2 = await storage.getUsers();
      const announcements2 = await storage.getAnnouncements();
      const activities2 = await storage.getActivities(100);
      const oneMonthAgo = /* @__PURE__ */ new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const twoMonthsAgo = /* @__PURE__ */ new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const oneDayAgo = /* @__PURE__ */ new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const currentPeriodDocs = documents2.filter(
        (doc2) => doc2.createdAt > oneMonthAgo
      );
      const previousPeriodDocs = documents2.filter(
        (doc2) => doc2.createdAt > twoMonthsAgo && doc2.createdAt <= oneMonthAgo
      );
      const currentPeriodAnnouncements = announcements2.filter(
        (ann) => ann.createdAt > oneMonthAgo
      );
      const previousPeriodAnnouncements = announcements2.filter(
        (ann) => doc.createdAt > twoMonthsAgo && doc.createdAt <= oneMonthAgo
      );
      const currentlyActiveUsers = new Set(
        activities2.filter((activity) => new Date(activity.createdAt) > oneDayAgo).map((activity) => activity.userId)
      );
      const lastMonthActiveUsers = new Set(
        activities2.filter((activity) => new Date(activity.createdAt) > oneMonthAgo).map((activity) => activity.userId)
      );
      const previousMonthActiveUsers = new Set(
        activities2.filter(
          (activity) => new Date(activity.createdAt) > twoMonthsAgo && new Date(activity.createdAt) <= oneMonthAgo
        ).map((activity) => activity.userId)
      );
      const calculateTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round((current - previous) / previous * 100);
      };
      const currentPeriodUsers = users2.filter((user) => new Date(user.createdAt) > oneMonthAgo).length;
      const previousPeriodUsers = users2.filter(
        (user) => new Date(user.createdAt) > twoMonthsAgo && new Date(user.createdAt) <= oneMonthAgo
      ).length;
      const stats = {
        totalDocuments: documents2.length,
        totalUsers: users2.length,
        activeUsers: currentlyActiveUsers.size,
        totalAnnouncements: announcements2.length,
        // Trends as percentage change
        documentsTrend: calculateTrend(currentPeriodDocs.length, previousPeriodDocs.length),
        usersTrend: calculateTrend(currentPeriodUsers, previousPeriodUsers),
        activeUsersTrend: calculateTrend(lastMonthActiveUsers.size, previousMonthActiveUsers.size),
        announcementsTrend: calculateTrend(currentPeriodAnnouncements.length, previousPeriodAnnouncements.length)
      };
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/financials/revenue", async (req, res) => {
    try {
      const results = await db.select().from(revenue).orderBy(desc(revenue.date));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue data" });
    }
  });
  app2.post("/api/financials/revenue", async (req, res) => {
    try {
      const { source, amount, date, description } = req.body;
      if (!source || !amount || !date) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const [result] = await db.insert(revenue).values({
        source,
        amount: parseFloat(amount),
        date,
        description: description || null
      }).returning();
      res.json(result);
    } catch (error) {
      console.error("Revenue creation error:", error);
      res.status(500).json({ error: "Failed to create revenue entry" });
    }
  });
  app2.put("/api/financials/revenue/:id", async (req, res) => {
    try {
      const [result] = await db.update(revenue).set(req.body).where(eq2(revenue.id, parseInt(req.params.id))).returning();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update revenue entry" });
    }
  });
  app2.delete("/api/financials/revenue/:id", async (req, res) => {
    try {
      await db.delete(revenue).where(eq2(revenue.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete revenue entry" });
    }
  });
  app2.get("/api/financials/expenses", async (req, res) => {
    try {
      const results = await db.select().from(expenses).orderBy(desc(expenses.date));
      console.log("Sending expenses data to client:", results);
      const formattedResults = results.map((expense) => ({
        ...expense,
        amount: typeof expense.amount === "string" ? parseFloat(expense.amount) : expense.amount
      }));
      res.json(formattedResults);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ error: "Failed to fetch expenses data" });
    }
  });
  app2.post("/api/financials/expenses", async (req, res) => {
    try {
      const { category, amount, date, description } = req.body;
      if (!category || amount === void 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      let formattedDate = date;
      if (!date) {
        formattedDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      }
      const [result] = await db.insert(expenses).values({
        category,
        amount: parseFloat(amount),
        date: formattedDate,
        description: description || ""
      }).returning();
      res.json(result);
    } catch (error) {
      console.error("Expense creation error:", error);
      res.status(500).json({ error: "Failed to create expense entry" });
    }
  });
  app2.put("/api/financials/expenses/:id", async (req, res) => {
    try {
      const { category, amount, date, description } = req.body;
      let formattedDate = date;
      if (!date) {
        formattedDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      }
      const [result] = await db.update(expenses).set({
        category,
        amount: parseFloat(amount),
        date: formattedDate,
        description: description || ""
      }).where(eq2(expenses.id, parseInt(req.params.id))).returning();
      res.json(result);
    } catch (error) {
      console.error("Expense update error:", error);
      res.status(500).json({ error: "Failed to update expense entry" });
    }
  });
  app2.delete("/api/financials/expenses/:id", async (req, res) => {
    try {
      await db.delete(expenses).where(eq2(expenses.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense entry" });
    }
  });
  app2.get("/api/content/:id", isAuthenticated2, async (req, res) => {
    try {
      const { id } = req.params;
      const contentId = parseInt(id);
      if (isNaN(contentId)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      const [contentItem] = await db.select().from(contentItems).where(eq2(contentItems.id, contentId));
      if (!contentItem) {
        return res.status(404).json({ message: "Content not found" });
      }
      const history = await db.select().from(contentHistory).where(eq2(contentHistory.contentId, contentItem.id)).orderBy(desc(contentHistory.createdAt));
      res.json({ ...contentItem, history });
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  app2.get("/api/content", isAuthenticated2, async (req, res, next) => {
    try {
      const contentType = req.query.contentType || req.query.type;
      const status = req.query.status;
      const assignedTo = req.query.assignedTo;
      let query = db.select().from(contentItems);
      if (contentType) {
        query = query.where(eq2(contentItems.contentType, contentType));
      }
      if (status) {
        query = query.where(eq2(contentItems.status, status));
      }
      if (assignedTo) {
        query = query.where(eq2(contentItems.assignedTo, parseInt(assignedTo)));
      }
      const results = await query.orderBy(desc(contentItems.updatedAt));
      res.json(results);
    } catch (error) {
      console.error("Error fetching content items:", error);
      res.status(500).json({ error: "Failed to fetch content items" });
    }
  });
  app2.post("/api/content", isAuthenticated2, async (req, res, next) => {
    try {
      const { title, description, contentType, assignedTo, deadline } = req.body;
      if (!title || !contentType) {
        return res.status(400).json({ message: "Title and content type are required" });
      }
      const [contentItem] = await db.insert(contentItems).values({
        title,
        description: description || null,
        contentType,
        status: "draft",
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
        deadline: deadline || null,
        createdBy: req.user.id
      }).returning();
      await db.insert(contentHistory).values({
        contentId: contentItem.id,
        status: "draft",
        notes: "Content item created",
        createdBy: req.user.id
      });
      await storage.createActivity({
        type: "content_created",
        description: `${req.user.fullName} created ${contentType} content "${title}"`,
        userId: req.user.id
      });
      res.status(201).json(contentItem);
    } catch (error) {
      console.error("Content creation error:", error);
      res.status(500).json({ error: "Failed to create content item" });
    }
  });
  app2.put("/api/content/:id", isAuthenticated2, async (req, res, next) => {
    try {
      const contentId = parseInt(req.params.id);
      const { title, description, contentType, status, assignedTo, deadline } = req.body;
      const existingContent = await db.select().from(contentItems).where(eq2(contentItems.id, contentId));
      if (!existingContent.length) {
        return res.status(404).json({ message: "Content item not found" });
      }
      const [updatedContent] = await db.update(contentItems).set({
        title: title || existingContent[0].title,
        description: description !== void 0 ? description : existingContent[0].description,
        contentType: contentType || existingContent[0].contentType,
        status: status || existingContent[0].status,
        assignedTo: assignedTo ? parseInt(assignedTo) : existingContent[0].assignedTo,
        deadline: deadline || existingContent[0].deadline,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }).where(eq2(contentItems.id, contentId)).returning();
      if (status && status !== existingContent[0].status) {
        await db.insert(contentHistory).values({
          contentId,
          status,
          notes: req.body.notes || `Status changed to ${status}`,
          createdBy: req.user.id
        });
        await storage.createActivity({
          type: "content_updated",
          description: `${req.user.fullName} updated ${updatedContent.contentType} content "${updatedContent.title}" to ${status}`,
          userId: req.user.id
        });
      }
      res.json(updatedContent);
    } catch (error) {
      console.error("Content update error:", error);
      res.status(500).json({ error: "Failed to update content item" });
    }
  });
  app2.delete("/api/content/:id", isAuthenticated2, async (req, res, next) => {
    try {
      const contentId = parseInt(req.params.id);
      await db.delete(contentHistory).where(eq2(contentHistory.contentId, contentId));
      await db.delete(contentItems).where(eq2(contentItems.id, contentId));
      res.json({ success: true });
    } catch (error) {
      console.error("Content deletion error:", error);
      res.status(500).json({ error: "Failed to delete content item" });
    }
  });
  app2.get("/api/workflows", isAuthenticated2, async (req, res, next) => {
    try {
      const contentType = req.query.type;
      let query = db.select().from(contentWorkflows);
      if (contentType) {
        query = query.where(eq2(contentWorkflows.contentType, contentType));
      }
      const results = await query;
      res.json(results);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ error: "Failed to fetch workflows" });
    }
  });
  app2.post("/api/workflows", isAdmin, async (req, res, next) => {
    try {
      const { name, contentType, steps } = req.body;
      if (!name || !contentType || !steps) {
        return res.status(400).json({ message: "Name, content type, and steps are required" });
      }
      const [workflow] = await db.insert(contentWorkflows).values({
        name,
        contentType,
        steps: JSON.stringify(steps)
      }).returning();
      res.status(201).json(workflow);
    } catch (error) {
      console.error("Workflow creation error:", error);
      res.status(500).json({ error: "Failed to create workflow" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname, "client", "src"),
      "@shared": path2.resolve(__dirname, "shared")
    }
  },
  root: path2.resolve(__dirname, "client"),
  build: {
    outDir: path2.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname2, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT || 5e3;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`Server running on http://0.0.0.0:${port}`);
  });
})();
