
import { db } from "../server/db";

async function createSampleWorkflow() {
  console.log("Creating sample content workflow...");
  
  // Check if workflow already exists
  const existing = await db.get(`
    SELECT * FROM content_workflows WHERE content_type = 'blog' LIMIT 1
  `);
  
  if (existing) {
    console.log("Sample workflow already exists, skipping creation");
    return;
  }

  // Blog workflow
  const blogWorkflowSteps = JSON.stringify([
    "Draft Content",
    "Review by Editor",
    "Revisions",
    "Final Approval",
    "Schedule Publication",
    "Publish"
  ]);
  
  await db.run(`
    INSERT INTO content_workflows (name, content_type, steps)
    VALUES ('Blog Post Workflow', 'blog', ?)
  `, [blogWorkflowSteps]);
  
  // Social media workflow
  const socialWorkflowSteps = JSON.stringify([
    "Draft Post",
    "Review by Social Team",
    "Prepare Media",
    "Approval",
    "Schedule",
    "Publish"
  ]);
  
  await db.run(`
    INSERT INTO content_workflows (name, content_type, steps)
    VALUES ('Social Media Workflow', 'social', ?)
  `, [socialWorkflowSteps]);
  
  // Product workflow
  const productWorkflowSteps = JSON.stringify([
    "Draft Product Content",
    "Review by Product Team",
    "Add Images & Media",
    "Price & Inventory Check",
    "Final Approval",
    "Publish to Store"
  ]);
  
  await db.run(`
    INSERT INTO content_workflows (name, content_type, steps)
    VALUES ('Product Listing Workflow', 'product', ?)
  `, [productWorkflowSteps]);

  console.log("Sample workflows created successfully!");
}

createSampleWorkflow()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error creating sample workflows:", error);
    process.exit(1);
  });
