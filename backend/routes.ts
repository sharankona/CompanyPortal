import { Router } from "express";
import { eq, desc, and, like, or } from "drizzle-orm";
import { db } from "./database";
import {
  users,
  documents,
  events,
  announcements,
  news,
  content,
  expenses,
  revenue,
  workflowSteps,
  workflows,
  contentPlatforms,
  analytics,
  employees,
  budgets,
} from "./backend/shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { readFile, unlink } from "fs/promises";
import { existsSync } from "fs";

const router = Router();

router.get("/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;