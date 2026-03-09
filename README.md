# Westbridge

Multi-tenant SaaS ERP platform built on Next.js with ERPNext as a headless backend. Invoicing, inventory, HR, payroll, CRM, and AI-powered insights — designed for small-to-medium businesses.

## Architecture

```
app/api/           → Route handlers (HTTP layer)
lib/services/      → Business logic (Result<T, E> pattern)
lib/data/          → Data access (ERPNext, Prisma, 2Checkout)
lib/               → Cross-cutting concerns (auth, CSRF, encryption, rate limiting)
```

**Tech stack:** Next.js 16 (App Router), TypeScript, Prisma (PostgreSQL), Redis, ERPNext v16 (headless), Sentry, OpenTelemetry, PostHog.

| Directory | Purpose |
|-----------|---------|
| `app/` | Routes, API handlers, pages (App Router) |
| `lib/` | Business logic, services, data layer, auth, validation |
| `components/` | UI components (dashboard, marketing, shared) |
| `types/` | Shared types and Zod schemas |
| `prisma/` | Database schema and migrations |
| `e2e/` | Playwright end-to-end tests |
| `docs/` | Architecture decision records, runbooks, policies |

## Getting started

```bash
# One-command setup (deps, Docker, migrations, dev server)
./scripts/setup.sh
```

Or step by step:

```bash
npm install
cp .env.example .env              # fill in required values
docker compose up -d               # Postgres, Redis, ERPNext
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm test                           # unit tests (Vitest)
npm run test:coverage              # with coverage report
npm run test:e2e                   # E2E tests (Playwright, requires running app)
```

## Deploy

```bash
npm run verify:production          # pre-flight checks
npm run build                      # production build
npm start                          # start server
```

See `SETUP.md` for detailed setup, `docs/PRODUCTION-READINESS.md` for production checklist, and `CONTRIBUTING.md` for development conventions.

## License

[MIT](LICENSE)
