import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.05,
    replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0,
    replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,
    environment: process.env.NODE_ENV ?? "development",
    integrations: (integrations) => integrations.filter((i) => i.name !== "Feedback"),
  });
}
