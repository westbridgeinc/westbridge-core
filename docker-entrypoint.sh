#!/bin/sh
set -e
# Ensure app DB schema exists before starting Next.js
if command -v prisma >/dev/null 2>&1; then
  prisma db push --accept-data-loss --skip-generate 2>/dev/null || true
fi
exec node server.js
