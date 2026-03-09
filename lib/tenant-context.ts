/**
 * AsyncLocalStorage-based tenant context.
 * Used by withTenant() so the data layer can enforce accountId without passing it everywhere.
 */

import { AsyncLocalStorage } from "async_hooks";

export const tenantStorage = new AsyncLocalStorage<string>();

/**
 * Get the current accountId when running inside withTenant(accountId, fn).
 * Returns null when not in a tenant context (e.g. global cron, health check).
 */
export function getCurrentAccountId(): string | null {
  return tenantStorage.getStore() ?? null;
}

/**
 * Run fn with accountId set as the current tenant context.
 * Any code that uses getScopedPrisma() or getCurrentAccountId() inside fn will see this accountId.
 */
export function runWithTenant<T>(accountId: string, fn: () => Promise<T>): Promise<T> {
  if (!accountId || typeof accountId !== "string") {
    throw new Error("TENANT_REQUIRED: accountId must be a non-empty string");
  }
  return tenantStorage.run(accountId, fn);
}
