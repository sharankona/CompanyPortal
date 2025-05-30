// Script to create an admin user
import { db } from '../server/db';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function createAdminUser(): Promise<void> {
  try {
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists!');
      process.exit(0);
    }
    
    // Admin credentials - should be changed after first login
    const adminPassword = 'admin123'; // This is temporary and should be changed immediately
    
    // Create admin user
    const adminUser = {
      username: 'admin',
      password: await hashPassword(adminPassword),
      fullName: 'System Administrator',
      role: 'admin',
    };
    
    await db.insert(users).values(adminUser);
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('IMPORTANT: Please change this password after your first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();