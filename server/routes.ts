import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertDocumentSchema, insertAnnouncementSchema, revenue, expenses, contentItems, contentHistory, contentWorkflows } from "@shared/schema";
import { ValidationError } from "zod-validation-error";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

// Admin authorization middleware
function isAdmin(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  res.status(403).json({ message: "Forbidden - Admin access required" });
}

// The content routes are defined in the registerRoutes function
// so we need to ensure the app object is properly scoped

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // User registration
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, fullName, role } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user
      const user = await storage.createUser({
        username,
        password, // Note: In a production app, you should hash this password
        fullName,
        role: role || "user"
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  // User routes
  app.get("/api/users", isAuthenticated, async (req, res, next) => {
    try {
      const users = await storage.getUsers();
      // Make sure to safely handle password removal
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error('Error fetching users:', error);
      next(error);
    }
  });

  // Update user
  app.patch("/api/users/:id", isAdmin, async (req, res, next) => {
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

      // Prevent admin from modifying their own role or the only admin's role
      if (req.user.id === userId && role !== "admin") {
        return res.status(403).json({ message: "Cannot change your own admin role" });
      }

      const updatedUser = await storage.updateUser(userId, { role });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  // Delete user
  app.delete("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Log the delete attempt
      console.log(`Delete request for user ID: ${userId} by admin ID: ${req.user.id}`);

      // Check if the user ID is valid
      if (isNaN(userId)) {
        console.log(`Invalid user ID: ${req.params.id}`);
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Check if the user exists
      const user = await storage.getUser(userId);
      if (!user) {
        console.log(`User not found: ${userId}`);
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent admin from deleting themselves
      if (req.user.id === userId) {
        console.log(`Admin attempted to delete own account: ${userId}`);
        return res.status(403).json({ message: "Cannot delete your own account" });
      }

      console.log(`Proceeding to delete user ${userId}`);

      // Delete the user
      await storage.deleteUser(userId);

      // Return success response
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

  // Document routes
  app.get("/api/documents", isAuthenticated, async (req, res, next) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/documents/:id", isAuthenticated, async (req, res, next) => {
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

  app.post("/api/documents", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertDocumentSchema.parse({
        ...req.body,
        createdById: req.user.id
      });

      const document = await storage.createDocument(validatedData);

      // Create activity
      await storage.createActivity({
        type: "document_created",
        description: `${req.user.fullName} created document "${document.name}"`,
        userId: req.user.id,
        documentId: document.id
      });

      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  app.patch("/api/documents/:id", isAuthenticated, async (req, res, next) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const updatedDocument = await storage.updateDocument(documentId, req.body);

      // Create activity
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

  // Announcement routes
  app.get("/api/announcements", isAuthenticated, async (req, res, next) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/announcements", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertAnnouncementSchema.parse({
        ...req.body,
        createdById: req.user.id
      });

      const announcement = await storage.createAnnouncement(validatedData);

      // Create activity
      await storage.createActivity({
        type: "announcement_created",
        description: `${req.user.fullName} created announcement "${announcement.title}"`,
        userId: req.user.id,
      });

      res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // Activity routes
  app.get("/api/activities", isAuthenticated, async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      next(error);
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res, next) => {
    try {
      const documents = await storage.getDocuments();
      const users = await storage.getUsers();
      const announcements = await storage.getAnnouncements();
      const activities = await storage.getActivities(100);

      // Time calculations
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      // Get a more accurate active users count (users with activity in the last day)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Current period documents
      const currentPeriodDocs = documents.filter(doc => 
        doc.createdAt > oneMonthAgo
      );

      // Previous period documents (for trend)
      const previousPeriodDocs = documents.filter(doc => 
        doc.createdAt > twoMonthsAgo && doc.createdAt <= oneMonthAgo
      );

      // Current period announcements
      const currentPeriodAnnouncements = announcements.filter(ann => 
        ann.createdAt > oneMonthAgo
      );

      // Previous period announcements (for trend)
      const previousPeriodAnnouncements = announcements.filter(ann => 
        ann.createdAt > twoMonthsAgo && ann.createdAt <= oneMonthAgo
      );

      // Get currently active users (activity within the last day)
      const currentlyActiveUsers = new Set(
        activities
          .filter(activity => new Date(activity.createdAt) > oneDayAgo)
          .map(activity => activity.userId)
      );

      // Get users who were active in the last month for trend calculation
      const lastMonthActiveUsers = new Set(
        activities
          .filter(activity => new Date(activity.createdAt) > oneMonthAgo)
          .map(activity => activity.userId)
      );

      // Get users who were active in the previous month
      const previousMonthActiveUsers = new Set(
        activities
          .filter(activity => 
            new Date(activity.createdAt) > twoMonthsAgo && 
            new Date(activity.createdAt) <= oneMonthAgo
          )
          .map(activity => activity.userId)
      );

      // Calculate trends (percentage change)
      const calculateTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      // Users registered in current period vs previous period
      const currentPeriodUsers = users.filter(user => new Date(user.createdAt) > oneMonthAgo).length;
      const previousPeriodUsers = users.filter(user => 
        new Date(user.createdAt) > twoMonthsAgo && 
        new Date(user.createdAt) <= oneMonthAgo
      ).length;

      const stats = {
        totalDocuments: documents.length,
        totalUsers: users.length,
        activeUsers: currentlyActiveUsers.size,
        totalAnnouncements: announcements.length,

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

  // Financial routes
  app.get('/api/financials/revenue', async (req, res) => {
    try {
      const results = await db.select().from(revenue).orderBy(desc(revenue.date));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch revenue data' });
    }
  });

  app.post('/api/financials/revenue', async (req, res) => {
    try {
      // Validate required fields
      const { source, amount, date, description } = req.body;
      if (!source || !amount || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const [result] = await db.insert(revenue).values({
        source,
        amount: parseFloat(amount),
        date,
        description: description || null
      }).returning();

      res.json(result);
    } catch (error) {
      console.error('Revenue creation error:', error);
      res.status(500).json({ error: 'Failed to create revenue entry' });
    }
  });

  app.put('/api/financials/revenue/:id', async (req, res) => {
    try {
      const [result] = await db
        .update(revenue)
        .set(req.body)
        .where(eq(revenue.id, parseInt(req.params.id)))
        .returning();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update revenue entry' });
    }
  });

  app.delete('/api/financials/revenue/:id', async (req, res) => {
    try {
      await db.delete(revenue).where(eq(revenue.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete revenue entry' });
    }
  });

  // Similar routes for expenses
  app.get('/api/financials/expenses', async (req, res) => {
    try {
      const results = await db.select().from(expenses).orderBy(desc(expenses.date));

      // Log the data we're sending to the client
      console.log('Sending expenses data to client:', results);

      // Ensure all amounts are properly formatted as numbers
      const formattedResults = results.map(expense => ({
        ...expense,
        amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount
      }));

      res.json(formattedResults);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Failed to fetch expenses data' });
    }
  });

  app.post('/api/financials/expenses', async (req, res) => {
    try {
      // Get data from request body
      const { category, amount, date, description } = req.body;

      // Validate required fields
      if (!category || amount === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Ensure we have a valid date string format (YYYY-MM-DD)
      let formattedDate = date;
      if (!date) {
        formattedDate = new Date().toISOString().split('T')[0];
      }

      const [result] = await db.insert(expenses).values({
        category,
        amount: parseFloat(amount),
        date: formattedDate,
        description: description || ''
      }).returning();

      res.json(result);
    } catch (error) {
      console.error('Expense creation error:', error);
      res.status(500).json({ error: 'Failed to create expense entry' });
    }
  });

  app.put('/api/financials/expenses/:id', async (req, res) => {
    try {
      const { category, amount, date, description } = req.body;

      // Ensure we have a valid date string format (YYYY-MM-DD)
      let formattedDate = date;
      if (!date) {
        formattedDate = new Date().toISOString().split('T')[0];
      }

      const [result] = await db
        .update(expenses)
        .set({
          category,
          amount: parseFloat(amount),
          date: formattedDate,
          description: description || ''
        })
        .where(eq(expenses.id, parseInt(req.params.id)))
        .returning();
      res.json(result);
    } catch (error) {
      console.error('Expense update error:', error);
      res.status(500).json({ error: 'Failed to update expense entry' });
    }
  });

  app.delete('/api/financials/expenses/:id', async (req, res) => {
    try {
      await db
        .delete(expenses)
        .where(eq(expenses.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete expense entry' });
    }
  });

  // Content Pipeline routes
  // Get content by ID
  app.get("/api/content/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const contentId = parseInt(id);

      if (isNaN(contentId)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }

      const [contentItem] = await db
        .select()
        .from(contentItems)
        .where(eq(contentItems.id, contentId));

      if (!contentItem) {
        return res.status(404).json({ message: "Content not found" });
      }

      // Get content history
      const history = await db
        .select()
        .from(contentHistory)
        .where(eq(contentHistory.contentId, contentItem.id))
        .orderBy(desc(contentHistory.createdAt));

      res.json({ ...contentItem, history });
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Get all content or filter by content type
  app.get("/api/content", isAuthenticated, async (req, res, next) => {
    try {
      const contentType = req.query.contentType || req.query.type;
      const status = req.query.status;
      const assignedTo = req.query.assignedTo;

      let query = db.select().from(contentItems);

      if (contentType) {
        query = query.where(eq(contentItems.contentType, contentType as string));
      }

      if (status) {
        query = query.where(eq(contentItems.status, status as string));
      }

      if (assignedTo) {
        query = query.where(eq(contentItems.assignedTo, parseInt(assignedTo as string)));
      }

      const results = await query.orderBy(desc(contentItems.updatedAt));
      res.json(results);
    } catch (error) {
      console.error('Error fetching content items:', error);
      res.status(500).json({ error: 'Failed to fetch content items' });
    }
  });

  app.post("/api/content", isAuthenticated, async (req, res, next) => {
    try {
      const { title, description, contentType, assignedTo, deadline } = req.body;

      if (!title || !contentType) {
        return res.status(400).json({ message: "Title and content type are required" });
      }

      // Create content item
      const [contentItem] = await db.insert(contentItems).values({
        title,
        description: description || null,
        contentType,
        status: "draft",
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
        deadline: deadline || null,
        createdBy: req.user.id,
      }).returning();

      // Create initial history record
      await db.insert(contentHistory).values({
        contentId: contentItem.id,
        status: "draft",
        notes: "Content item created",
        createdBy: req.user.id,
      });

      // Create activity
      await storage.createActivity({
        type: "content_created",
        description: `${req.user.fullName} created ${contentType} content "${title}"`,
        userId: req.user.id,
      });

      res.status(201).json(contentItem);
    } catch (error) {
      console.error('Content creation error:', error);
      res.status(500).json({ error: 'Failed to create content item' });
    }
  });

  app.put("/api/content/:id", isAuthenticated, async (req, res, next) => {
    try {
      const contentId = parseInt(req.params.id);
      const { title, description, contentType, status, assignedTo, deadline } = req.body;

      // Check if content exists
      const existingContent = await db
        .select()
        .from(contentItems)
        .where(eq(contentItems.id, contentId));

      if (!existingContent.length) {
        return res.status(404).json({ message: "Content item not found" });
      }

      // Update content item
      const [updatedContent] = await db
        .update(contentItems)
        .set({
          title: title || existingContent[0].title,
          description: description !== undefined ? description : existingContent[0].description,
          contentType: contentType || existingContent[0].contentType,
          status: status || existingContent[0].status,
          assignedTo: assignedTo ? parseInt(assignedTo) : existingContent[0].assignedTo,
          deadline: deadline || existingContent[0].deadline,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(contentItems.id, contentId))
        .returning();

      // If status changed, add to history
      if (status && status !== existingContent[0].status) {
        await db.insert(contentHistory).values({
          contentId,
          status,
          notes: req.body.notes || `Status changed to ${status}`,
          createdBy: req.user.id,
        });

        // Create activity
        await storage.createActivity({
          type: "content_updated",
          description: `${req.user.fullName} updated ${updatedContent.contentType} content "${updatedContent.title}" to ${status}`,
          userId: req.user.id,
        });
      }

      res.json(updatedContent);
    } catch (error) {
      console.error('Content update error:', error);
      res.status(500).json({ error: 'Failed to update content item' });
    }
  });

  app.delete("/api/content/:id", isAuthenticated, async (req, res, next) => {
    try {
      const contentId = parseInt(req.params.id);

      // Delete content history first (foreign key constraint)
      await db.delete(contentHistory).where(eq(contentHistory.contentId, contentId));

      // Delete content item
      await db.delete(contentItems).where(eq(contentItems.id, contentId));

      res.json({ success: true });
    } catch (error) {
      console.error('Content deletion error:', error);
      res.status(500).json({ error: 'Failed to delete content item' });
    }
  });

  // Content Workflow routes
  app.get("/api/workflows", isAuthenticated, async (req, res, next) => {
    try {
      const contentType = req.query.type;

      let query = db.select().from(contentWorkflows);

      if (contentType) {
        query = query.where(eq(contentWorkflows.contentType, contentType as string));
      }

      const results = await query;
      res.json(results);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      res.status(500).json({ error: 'Failed to fetch workflows' });
    }
  });

  app.post("/api/workflows", isAdmin, async (req, res, next) => {
    try {
      const { name, contentType, steps } = req.body;

      if (!name || !contentType || !steps) {
        return res.status(400).json({ message: "Name, content type, and steps are required" });
      }

      const [workflow] = await db.insert(contentWorkflows).values({
        name,
        contentType,
        steps: JSON.stringify(steps),
      }).returning();

      res.status(201).json(workflow);
    } catch (error) {
      console.error('Workflow creation error:', error);
      res.status(500).json({ error: 'Failed to create workflow' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Similar routes for invoices and budget...