
import { db } from "../server/db";
import { expenses } from "../shared/schema";

async function viewExpensesData() {
  try {
    console.log("Using SQLite database");
    console.log("Fetching expenses data...");
    
    // Get all expenses
    const allExpenses = await db.select().from(expenses);
    
    console.log("\nEXPENSES DATA:");
    console.log("==============");
    console.log("ID | Category | Amount | Date | Description");
    console.log("------------------------------------------");
    
    allExpenses.forEach(expense => {
      console.log(`${expense.id} | ${expense.category} | $${expense.amount} | ${expense.date} | ${expense.description || ''}`);
    });
    
    console.log("\nTotal records:", allExpenses.length);
  } catch (error) {
    console.error("Error fetching expenses data:", error);
  }
}

// Run the query
viewExpensesData();
