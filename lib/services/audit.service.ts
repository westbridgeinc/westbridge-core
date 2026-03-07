import { prisma } from "@/lib/data/prisma";
import { createHash } from "crypto";
import type * as Prisma from "@/lib/generated/prisma/internal/prismaNamespace";
import { logger } from "@/lib/logger";

export type AuditSeverity = "info" | "warn" | "critical";
export type AuditOutcome = "success" | "failure" | "error";

interface AuditEntry {
  accountId: string | null;
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  sessionId?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  /** JSON diff of before/after for mutations. */
  changes?: { before?: Record<string, unknown>; after?: Record<string, unknown> };
  /** Additional key/value metadata. */
  meta?: Record<string, unknown>;
  /** @deprecated use meta */
  metadata?: Record<string, unknown>;
  severity?: AuditSeverity;
  outcome?: AuditOutcome;
}

/** Redis key for the most recent audit log hash (for hash chain). */
const PREV_HASH_KEY = (accountId: string) => `audit:prevhash:${accountId}`;

async function getPrevHash(accountId: string): Promise<string> {
  try {
    const { getRedis } = await import("@/lib/redis");
    const redis = getRedis();
    return (await redis?.get(PREV_HASH_KEY(accountId))) ?? "GENESIS";
  } catch {
    return "GENESIS";
  }
}

async function setPrevHash(accountId: string, hash: string): Promise<void> {
  try {
    const { getRedis } = await import("@/lib/redis");
    const redis = getRedis();
    await redis?.set(PREV_HASH_KEY(accountId), hash, "EX", 30 * 24 * 60 * 60);
  } catch { /* non-critical */ }
}

/** Derive a rough geo-location country code from IP (no external calls). */
function geoFromIp(ip: string | null | undefined): string | null {
  // Real implementation uses a local GeoIP database (e.g. geoip-lite).
  // Placeholder: return null until the package is added.
  if (!ip) return null;
  return null;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  // System events (no accountId) are only logged structurally — no DB write since accountId is required
  if (!entry.accountId) {
    logger.info("audit.system_event", {
      action: entry.action,
      severity: entry.severity ?? "info",
      outcome: entry.outcome ?? "success",
      ipAddress: entry.ipAddress,
      ...(entry.meta ?? entry.metadata ?? {}),
    });
    return;
  }
  try {
    const accountId = entry.accountId;
    const meta = { ...(entry.metadata ?? {}), ...(entry.meta ?? {}) };
    const geo = geoFromIp(entry.ipAddress);
    const prevHash = await getPrevHash(accountId);

    const payload = JSON.stringify({
      accountId,
      action: entry.action,
      timestamp: new Date().toISOString(),
      prevHash,
    });
    const entryHash = createHash("sha256").update(payload).digest("hex");

    await prisma.auditLog.create({
      data: {
        accountId,
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
        metadata: ({
          ...meta,
          ...(entry.changes ? { changes: entry.changes } : {}),
          ...(geo ? { geo } : {}),
          ...(entry.sessionId ? { sessionId: entry.sessionId } : {}),
          _hash: entryHash,
          _prevHash: prevHash,
        } as Prisma.InputJsonValue),
        severity: entry.severity ?? "info",
        outcome: entry.outcome ?? "success",
      },
    });

    await setPrevHash(accountId, entryHash);
  } catch (err) {
    logger.error("audit_log_write_failed", {
      action: entry.action,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}

/** Helper to extract request context for audit entries. */
export function auditContext(request: Request): { ipAddress: string; userAgent: string } {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown",
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };
}
