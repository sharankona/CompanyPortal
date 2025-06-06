
#!/bin/bash

echo "Building client..."
cd client
npm install
npm run build

echo "Building server..."
cd ../
npm install

echo "Setting up database..."
npm run db:push

echo "Build complete!"
