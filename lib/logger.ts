/**
 * Simple structured logger for API routes.
 * In production, replace with your preferred service (e.g. send to Logtail, Datadog).
 */

type Level = "error" | "warn" | "info";

function log(level: Level, message: string, meta?: Record<string, unknown>) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
  };
  const out = level === "error" ? console.error : level === "warn" ? console.warn : console.info;
  out(JSON.stringify(payload));
}

export const logger = {
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
};
