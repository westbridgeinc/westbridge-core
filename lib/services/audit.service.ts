/**
 * Audit logging: fire-and-forget. Do not await in the request path.
 */

import { prisma } from "@/lib/data/prisma";

export async function logAction(params: {
  accountId: string;
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}): Promise<void> {
  const { accountId, userId, action, resource, resourceId, metadata, ipAddress } = params;
  try {
    await prisma.auditLog.create({
      data: {
        accountId,
        userId: userId ?? undefined,
        action,
        resource: resource ?? undefined,
        resourceId: resourceId ?? undefined,
        metadata: (metadata ?? undefined) as object | undefined,
        ipAddress: ipAddress ?? undefined,
      },
    });
  } catch (e) {
    const { logger } = await import("@/lib/logger");
    logger.error("Audit log write failed", { action, accountId, error: e instanceof Error ? e.message : String(e) });
  }
}
