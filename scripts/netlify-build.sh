#!/bin/bash
set -e

echo "🔧 Starting Netlify build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client with explicit binary target
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Verify the RHEL binary exists (check both formats)
if [ -f "node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node" ]; then
    echo "✅ RHEL library binary found"
    ls -la node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node
elif [ -f "node_modules/.prisma/client/query-engine-rhel-openssl-3.0.x" ]; then
    echo "✅ RHEL query engine binary found"
    ls -la node_modules/.prisma/client/query-engine-rhel-openssl-3.0.x
else
    echo "❌ RHEL binary NOT found"
    echo "Available files:"
    ls -la node_modules/.prisma/client/
fi

# Build Next.js app
echo "🏗️ Building Next.js app..."
npm run build

echo "✅ Build completed successfully!"