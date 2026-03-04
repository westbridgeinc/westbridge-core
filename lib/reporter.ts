/**
 * Error reporter — structured log + optional Sentry.
 * To enable Sentry: npm install @sentry/nextjs, set NEXT_PUBLIC_SENTRY_DSN,
 * and in this file add: import * as Sentry from "@sentry/nextjs"; then call Sentry.captureException(error) below.
 */

import { logger } from "@/lib/logger";

export function reportError(error: unknown, context?: Record<string, unknown>): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  logger.error("Reported error", { error: message, stack, ...context });
  // Sentry: if @sentry/nextjs is installed and configured, uncomment:
  // if (typeof Sentry !== "undefined") Sentry.captureException(error);
}
