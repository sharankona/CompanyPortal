import { db } from '../server/db';
import { roleEnum, departmentEnum, users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function initializeDb() {
  try {
    console.log('Checking for admin user...');
    
    // Check if admin user exists
    const adminUser = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);
    
    if (adminUser.length === 0) {
      console.log('Creating default admin user...');
      
      // Create default admin user
      await db.insert(users).values({
        username: 'admin',
        password: '$2b$10$9scJR99fQOk2HNBMgnVcoO7Hh8yw8hvR4qchYY90HrH7ECd2UFLt.', // admin123
        email: 'admin@company.com',
        fullName: 'Admin User',
        title: 'System Administrator',
        department: 'Engineering',
        role: 'admin'
      });
      
      console.log('Default admin user created successfully!');
    } else {
      console.log('Admin user already exists, skipping creation.');
    }
    
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDb()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error during initialization:', error);
    process.exit(1);
  });