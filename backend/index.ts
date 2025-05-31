import express from "express";
import { createServer } from "http";
import { fileURLToPath } from "url";
import path from "path";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "./backend/shared/schema";
import { db } from "./database";
import { setupVite } from "./vite";
import routes from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);