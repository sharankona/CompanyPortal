
import { storage } from "../server/storage";

async function viewUsers() {
  try {
    console.log("Fetching users from database...");
    const users = await storage.getUsers();
    
    // Remove passwords from the output for security
    const safeUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    console.log("Users found:", safeUsers.length);
    console.log(JSON.stringify(safeUsers, null, 2));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

viewUsers();
