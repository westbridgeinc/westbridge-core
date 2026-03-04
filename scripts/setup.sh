#!/usr/bin/env bash
# Westbridge local setup: env, deps, DB. Run from project root.

set -e
cd "$(dirname "$0")/.."

echo "=== Westbridge setup ==="

# 1. .env
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "  .env created. Edit DATABASE_URL if not using Docker Postgres."
else
  echo ".env already exists."
fi

# 2. Dependencies
echo "Installing npm dependencies..."
npm install

# 3. Prisma
echo "Generating Prisma client..."
npx prisma generate

# 4. Database (requires Postgres running)
echo "Pushing schema to database (creates tables if missing)..."
if npx prisma db push 2>/dev/null; then
  echo "  Database ready."
else
  echo "  WARNING: Could not reach database. Start Docker first:"
  echo "    docker compose up -d postgres"
  echo "  Then run: npx prisma db push"
fi

echo ""
echo "=== Next steps ==="
echo "1. Start backend:  docker compose up -d"
echo "2. (Optional) Create ERPNext site: see SETUP.md"
echo "3. Run app:        npm run dev"
echo "4. Open:           http://localhost:3000"
echo ""
