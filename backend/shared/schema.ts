import { sqliteTable, text, integer, blob, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Express, Request, Response, NextFunction } from 'express'; // Import Express types

// User model with role-based access
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"), // admin, user
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Document model
export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"), // draft, review, published
  createdById: integer("created_by_id").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

// Announcement model
export const announcements = sqliteTable("announcements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // company, important, hr
  createdById: integer("created_by_id").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Activity model
export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // document_created, document_modified, user_joined, etc.
  description: text("description").notNull(),
  userId: integer("user_id").notNull(),
  documentId: integer("document_id"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Content pipeline tables
export const contentItems = sqliteTable("content_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(), // blog, social, product
  status: text("status").notNull().default("draft"), // draft, review, approved, scheduled, published
  assignedTo: integer("assigned_to"),
  deadline: text("deadline"),
  createdBy: integer("created_by").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const contentWorkflows = sqliteTable("content_workflows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contentType: text("content_type").notNull(), // blog, social, product
  steps: text("steps").notNull(), // JSON string of workflow steps
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const contentHistory = sqliteTable("content_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contentId: integer("content_id").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Financial tables
export const revenue = sqliteTable('revenue', {
  id: integer('id').primaryKey(),
  source: text('source').notNull(),
  amount: real('amount').notNull(),
  date: text('date').notNull(),
  description: text('description')
});

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey(),
  category: text('category').notNull(),
  amount: real('amount').notNull(),
  date: text('date').notNull(),
  description: text('description')
});

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull(),
  clientName: text("client_name").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(), // paid, pending, overdue
  dueDate: text("due_date").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const budget = sqliteTable("budget", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  plannedAmount: integer("planned_amount").notNull(),
  actualAmount: integer("actual_amount").default(0),
  period: text("period").notNull(), // monthly, quarterly, yearly
  year: integer("year").notNull(),
  month: integer("month"), // 1-12 for monthly
  quarter: integer("quarter"), // 1-4 for quarterly
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const financialMetrics = sqliteTable("financial_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  value: integer("value").notNull(),
  description: text("description"),
  period: text("period").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

export const insertDocumentSchema = z.object({
  name: z.string(),
  contentType: z.string(),
  size: z.number(),
  createdById: z.number()
});

export const insertAnnouncementSchema = z.object({
  title: z.string(),
  content: z.string(),
  createdById: z.number()
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  description: true,
  userId: true,
  documentId: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Activity = typeof activities.$inferSelect;

// Placeholder for the Express app instance
let app: Express;

// Middleware to check authentication
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // Implement your authentication logic here
    // For example, check for a valid token in the headers
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token (replace with your actual verification logic)
    if (token !== "valid-token") {
        return res.status(403).json({ message: "Forbidden" });
    }

    // If authentication is successful, proceed to the next middleware/route handler
    next();
};

// Function to define and attach the content pipeline routes
function defineContentPipelineRoutes(app: Express) {
  app.get("/api/content", isAuthenticated, async (req, res, next) => {
      try {
          // Implement logic to fetch content items
          const contentItems = [
              { id: 1, title: "Sample Content 1" },
              { id: 2, title: "Sample Content 2" },
          ]; // Replace with your database query

          res.json(contentItems);
      } catch (error) {
          next(error);
      }
  });

  app.post("/api/content", isAuthenticated, async (req, res, next) => {
      try {
          // Implement logic to create content item
          const newContent = { id: 3, title: req.body.title }; // Replace with your database insertion
          res.status(201).json(newContent);
      } catch (error) {
          next(error);
      }
  });

  app.put("/api/content/:id", isAuthenticated, async (req, res, next) => {
      try {
          // Implement logic to update content item
          const updatedContent = { id: req.params.id, title: req.body.title }; // Replace with your database update
          res.json(updatedContent);
      } catch (error) {
          next(error);
      }
  });

  app.delete("/api/content/:id", isAuthenticated, async (req, res, next) => {
      try {
          // Implement logic to delete content item
          res.status(204).send();
      } catch (error) {
          next(error);
      }
  });
}

// Call the function to define the routes
// This assumes that 'app' is an instance of an Express application
// defineContentPipelineRoutes(app);
// Example usage if you have access to the app object:
// Assuming you have an Express app instance named 'app':
// app = express(); //  initialize your express app somewhere
// defineContentPipelineRoutes(app);

// Export the function if needed
export { defineContentPipelineRoutes };