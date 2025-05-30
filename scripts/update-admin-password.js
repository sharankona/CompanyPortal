import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateAdminPassword() {
  try {
    console.log('Updating admin password hash...');
    
    // Update admin user with correct password hash for 'admin123'
    const result = await db.update(users)
      .set({ 
        password: '$2b$10$9scJR99fQOk2HNBMgnVcoO7Hh8yw8hvR4qchYY90HrH7ECd2UFLt.' 
      })
      .where(eq(users.username, 'admin'));
    
    console.log('Admin password updated successfully!');
    console.log('Rows affected:', result.count);
    
  } catch (error) {
    console.error('Error updating admin password:', error);
    process.exit(1);
  }
}

updateAdminPassword()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error during update:', error);
    process.exit(1);
  });