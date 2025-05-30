#!/bin/bash

echo "Starting database setup..."

# Run Drizzle migration
echo "Running database migrations..."
npx drizzle-kit push

# Initialize database with default data
echo "Initializing database with default data..."
npx tsx scripts/init-db.ts

echo "Database setup complete!"