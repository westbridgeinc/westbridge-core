/**
 * Multi-tenancy enforcement utilities.
 * Prefer getScopedPrisma(accountId) from lib/data/scoped-prisma for tenant-scoped
 * reads/writes — it injects accountId into where clauses so cross-tenant queries cannot happen.
 *
 * withTenant(accountId, fn) runs fn with tenant context set and passes a scoped Prisma client
 * so all tenant-model queries are automatically limited to that account.
 */
import { getScopedPrisma } from "@/lib/data/scoped-prisma";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { runWithTenant } from "@/lib/tenant-context";
import { logger } from "@/lib/logger";

/**
 * Execute a Prisma operation scoped to a specific tenant.
 * Uses a scoped client that injects accountId into where clauses for tenant models.
 * Also sets tenant context (getCurrentAccountId()) for the duration of fn.
 */
export async function withTenant<T>(
  accountId: string,
  fn: (db: PrismaClient) => Promise<T>
): Promise<T> {
  if (!accountId || typeof accountId !== "string") {
    logger.error("withTenant called without valid accountId — blocking query");
    throw new Error("TENANT_REQUIRED: accountId must be provided for all tenant-scoped queries");
  }
  const scoped = getScopedPrisma(accountId);
  return runWithTenant(accountId, () => fn(scoped));
}

/**
 * Assert that a resource belongs to the given tenant.
 * Throws if the accountId doesn't match — use this after loading a record to prevent IDOR.
 */
export function assertTenant(
  resourceAccountId: string | null | undefined,
  requestAccountId: string,
  resourceType: string
): void {
  if (resourceAccountId !== requestAccountId) {
    logger.error("Tenant isolation violation", {
      expected: requestAccountId,
      got: resourceAccountId,
      resourceType,
    });
    throw new Error(`TENANT_VIOLATION: ${resourceType} does not belong to account ${requestAccountId}`);
  }
}

/**
 * Prisma middleware factory that logs queries missing accountId on tenant-sensitive models.
 * Attach this to your Prisma client in lib/data/prisma.ts via prisma.$use().
 *
 * Note: Prisma v5+ uses $extends() instead of $use(). This is the $use() version for compatibility.
 */
export function createTenantAuditMiddleware() {
  const TENANT_MODELS = new Set([
    "Session",
    "User",
    "AuditLog",
    "InviteToken",
    "PasswordResetToken",
  ]);

  return async (
    params: {
      model?: string;
      action: string;
      args: Record<string, unknown>;
      runInTransaction: boolean;
    },
    next: (params: unknown) => Promise<unknown>
  ) => {
    if (
      params.model &&
      TENANT_MODELS.has(params.model) &&
      ["findMany", "findFirst", "updateMany", "deleteMany"].includes(params.action)
    ) {
      const where = params.args?.where as Record<string, unknown> | undefined;
      if (!where?.accountId) {
        logger.warn("Tenant-sensitive query missing accountId filter", {
          model: params.model,
          action: params.action,
        });
      }
    }
    return next(params);
  };
}
