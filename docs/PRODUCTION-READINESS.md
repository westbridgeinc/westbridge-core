# Production readiness

**Short answer:** The app is **production-capable** for an MVP/launch: architecture, security baseline, and UX are in place. For the “Fortune 500 CTO” bar, a few additions are recommended.

---

## ✅ In place

| Area | Status |
|------|--------|
| **Architecture** | Three-layer: presentation → `lib/services/*` → `lib/data/*`. No business logic in API routes or components. |
| **API contract** | All APIs return `{ data, meta }` or `{ error, meta }`. Result pattern in services. |
| **Security** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy; HSTS in production. **CSP** in next.config. **CSRF** on login, signup, ERP doc POST (token from GET /api/csrf, X-CSRF-Token header). Auth/signup/webhook rate limited. Secrets in env; health hides env in production. |
| **Validation** | **Zod** schemas for auth (login/signup), ERP doc create, and API meta/error; request bodies validated in API routes; 400 + message on validation failure. |
| **Errors** | Root and dashboard error boundaries; global error fallback. **Error reporter** (`lib/reporter.ts`) called from boundaries; Sentry-ready. Structured logger (no raw `console.log` in app code). |
| **Dashboard UX** | **Breadcrumbs** on all dashboard pages; PageHeader, MetricCard, StatusBadge. |
| **Tests** | **Vitest** unit tests: auth.service (login validation, erpLogin success/failure), auth schemas. Run: `npm run test`. |
| **Types** | No `any` in application code (only in generated Prisma). Explicit types in services and API. |
| **Config** | `lib/config/site.ts` and `lib/env.ts`; required env validated at runtime. |
| **UX** | Route groups, shared layout (marketing/auth/dashboard), Inter font, loading/error states on key dashboard pages. |

---

## ⚠️ Optional next steps

1. **Data scoping**  
   If multiple companies share one ERPNext instance, scope list/doc (and other ERP access) by account (e.g. `westbridge_account_id` cookie set at login).

2. **Sentry**  
   Install `@sentry/nextjs`, set `NEXT_PUBLIC_SENTRY_DSN`, and call `Sentry.captureException(error)` inside `lib/reporter.ts` for production error tracking.

3. **More tests**  
   Add tests for more services (erp, billing), API route handlers, and/or Playwright for critical user flows.

---

## Verdict

- **Ship as MVP / first production release:** Yes, with the current security and structure.
- **“Stripe/Linear/Vercel” bar:** Zod, CSP, CSRF, breadcrumbs, error reporter, and unit tests are in place; optional: data scoping, Sentry, more tests.
