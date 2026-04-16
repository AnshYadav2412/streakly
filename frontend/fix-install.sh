#!/bin/bash

echo "🧹 Cleaning up corrupted files..."

# Remove node_modules
if [ -d "node_modules" ]; then
    echo "Removing node_modules..."
    rm -rf node_modules
fi

# Remove package-lock.json
if [ -f "package-lock.json" ]; then
    echo "Removing package-lock.json..."
    rm -f package-lock.json
fi

# Remove dev-dist
if [ -d "dev-dist" ]; then
    echo "Removing dev-dist..."
    rm -rf dev-dist
fi

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

echo ""
echo "📦 Installing fresh dependencies..."
npm install --legacy-peer-deps

echo ""
echo "✅ Done! You can now run: npm run dev"
