
import { db } from "../server/db";
import { expenses } from "../shared/schema";
import { eq } from "drizzle-orm";

async function fixExpensesData() {
  try {
    console.log("Fixing expenses data...");
    
    // Get all expenses
    const allExpenses = await db.select().from(expenses);
    
    for (const expense of allExpenses) {
      // Fix amount if it's not a valid number
      const amount = typeof expense.amount === 'number' && !isNaN(expense.amount) 
        ? expense.amount 
        : 0;
      
      // Fix date if it's not a valid date
      let date = expense.date;
      try {
        // Check if date is valid, if not set to today
        const dateObj = new Date(expense.date);
        if (isNaN(dateObj.getTime())) {
          date = new Date().toISOString().split('T')[0];
        } else {
          // Format as YYYY-MM-DD
          date = dateObj.toISOString().split('T')[0];
        }
      } catch (e) {
        date = new Date().toISOString().split('T')[0];
      }
      
      // Update the expense
      await db.update(expenses)
        .set({ 
          amount: amount,
          date: date
        })
        .where(eq(expenses.id, expense.id));
      
      console.log(`Fixed expense ID ${expense.id}: amount=${amount}, date=${date}`);
    }
    
    console.log("All expenses data fixed successfully!");
  } catch (error) {
    console.error("Error fixing expenses data:", error);
  }
}

// Run the fix
fixExpensesData();
