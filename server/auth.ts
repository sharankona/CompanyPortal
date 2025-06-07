import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { ValidationError } from "zod-validation-error";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Registration schema with validation
const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(2, "Full name is required"),
});

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || "dev-secret-key-change-in-production";
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  };

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        } 
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate input
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: await hashPassword(validatedData.password),
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Log in the user
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Create activity for new user
        storage.createActivity({
          type: "user_joined",
          description: `${user.fullName} joined the company`,
          userId: user.id,
        });
        
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}
