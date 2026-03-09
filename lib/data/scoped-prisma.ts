/**
 * Tenant-scoped Prisma client. Injects accountId into where clauses for tenant models
 * so it is impossible to query another account's data.
 *
 * Use in services: getScopedPrisma(session.accountId) for all tenant-scoped reads/writes.
 * For findUnique by id, still use assertTenant() after loading to verify ownership.
 */

import { prisma } from "@/lib/data/prisma";
import type { PrismaClient } from "@/lib/generated/prisma/client";

function mergeAccountId<T extends Record<string, unknown>>(
  accountId: string,
  args: T
): T & { where: Record<string, unknown> } {
  const where = (args?.where as Record<string, unknown>) ?? {};
  return {
    ...args,
    where: { ...where, accountId },
  } as T & { where: Record<string, unknown> };
}

/**
 * Returns a Prisma-like client that automatically scopes queries to the given accountId
 * for tenant models (User, AuditLog, Subscription, ApiKey, InviteToken, WebhookEndpoint).
 * Use this in the service layer whenever you have session.accountId.
 */
export function getScopedPrisma(accountId: string): PrismaClient {
  if (!accountId || typeof accountId !== "string") {
    throw new Error("TENANT_REQUIRED: accountId must be provided for scoped Prisma");
  }

  const scope = {
    user: {
      findMany: (args: Parameters<PrismaClient["user"]["findMany"]>[0]) =>
        prisma.user.findMany(mergeAccountId(accountId, args ?? {}) as never),
      findFirst: (args: Parameters<PrismaClient["user"]["findFirst"]>[0]) =>
        prisma.user.findFirst(mergeAccountId(accountId, args ?? {}) as never),
      findUnique: prisma.user.findUnique.bind(prisma.user),
      create: prisma.user.create.bind(prisma.user),
      update: prisma.user.update.bind(prisma.user),
      updateMany: (args: Parameters<PrismaClient["user"]["updateMany"]>[0]) =>
        prisma.user.updateMany(mergeAccountId(accountId, args ?? {}) as never),
      delete: prisma.user.delete.bind(prisma.user),
      deleteMany: (args: Parameters<PrismaClient["user"]["deleteMany"]>[0]) =>
        prisma.user.deleteMany(mergeAccountId(accountId, args ?? {}) as never),
    },
    auditLog: {
      findMany: (args: Parameters<PrismaClient["auditLog"]["findMany"]>[0]) =>
        prisma.auditLog.findMany(mergeAccountId(accountId, args ?? {}) as never),
      findFirst: (args: Parameters<PrismaClient["auditLog"]["findFirst"]>[0]) =>
        prisma.auditLog.findFirst(mergeAccountId(accountId, args ?? {}) as never),
      findUnique: prisma.auditLog.findUnique.bind(prisma.auditLog),
      create: prisma.auditLog.create.bind(prisma.auditLog),
      update: prisma.auditLog.update.bind(prisma.auditLog),
      updateMany: (args: Parameters<PrismaClient["auditLog"]["updateMany"]>[0]) =>
        prisma.auditLog.updateMany(mergeAccountId(accountId, args ?? {}) as never),
      delete: prisma.auditLog.delete.bind(prisma.auditLog),
      deleteMany: (args: Parameters<PrismaClient["auditLog"]["deleteMany"]>[0]) =>
        prisma.auditLog.deleteMany(mergeAccountId(accountId, args ?? {}) as never),
    },
    subscription: {
      findMany: (args: Parameters<PrismaClient["subscription"]["findMany"]>[0]) =>
        prisma.subscription.findMany(mergeAccountId(accountId, args ?? {}) as never),
      findFirst: (args: Parameters<PrismaClient["subscription"]["findFirst"]>[0]) =>
        prisma.subscription.findFirst(mergeAccountId(accountId, args ?? {}) as never),
      findUnique: prisma.subscription.findUnique.bind(prisma.subscription),
      create: prisma.subscription.create.bind(prisma.subscription),
      update: prisma.subscription.update.bind(prisma.subscription),
      updateMany: (args: Parameters<PrismaClient["subscription"]["updateMany"]>[0]) =>
        prisma.subscription.updateMany(mergeAccountId(accountId, args ?? {}) as never),
      delete: prisma.subscription.delete.bind(prisma.subscription),
      deleteMany: (args: Parameters<PrismaClient["subscription"]["deleteMany"]>[0]) =>
        prisma.subscription.deleteMany(mergeAccountId(accountId, args ?? {}) as never),
    },
    apiKey: {
      findMany: (args: Parameters<PrismaClient["apiKey"]["findMany"]>[0]) =>
        prisma.apiKey.findMany(mergeAccountId(accountId, args ?? {}) as never),
      findFirst: (args: Parameters<PrismaClient["apiKey"]["findFirst"]>[0]) =>
        prisma.apiKey.findFirst(mergeAccountId(accountId, args ?? {}) as never),
      findUnique: prisma.apiKey.findUnique.bind(prisma.apiKey),
      create: prisma.apiKey.create.bind(prisma.apiKey),
      update: prisma.apiKey.update.bind(prisma.apiKey),
      updateMany: (args: Parameters<PrismaClient["apiKey"]["updateMany"]>[0]) =>
        prisma.apiKey.updateMany(mergeAccountId(accountId, args ?? {}) as never),
      delete: prisma.apiKey.delete.bind(prisma.apiKey),
      deleteMany: (args: Parameters<PrismaClient["apiKey"]["deleteMany"]>[0]) =>
        prisma.apiKey.deleteMany(mergeAccountId(accountId, args ?? {}) as never),
    },
    inviteToken: {
      findMany: (args: Parameters<PrismaClient["inviteToken"]["findMany"]>[0]) =>
        prisma.inviteToken.findMany(mergeAccountId(accountId, args ?? {}) as never),
      findFirst: (args: Parameters<PrismaClient["inviteToken"]["findFirst"]>[0]) =>
        prisma.inviteToken.findFirst(mergeAccountId(accountId, args ?? {}) as never),
      findUnique: prisma.inviteToken.findUnique.bind(prisma.inviteToken),
      create: prisma.inviteToken.create.bind(prisma.inviteToken),
      update: prisma.inviteToken.update.bind(prisma.inviteToken),
      updateMany: (args: Parameters<PrismaClient["inviteToken"]["updateMany"]>[0]) =>
        prisma.inviteToken.updateMany(mergeAccountId(accountId, args ?? {}) as never),
      delete: prisma.inviteToken.delete.bind(prisma.inviteToken),
      deleteMany: (args: Parameters<PrismaClient["inviteToken"]["deleteMany"]>[0]) =>
        prisma.inviteToken.deleteMany(mergeAccountId(accountId, args ?? {}) as never),
    },
    webhookEndpoint: {
      findMany: (args: Parameters<PrismaClient["webhookEndpoint"]["findMany"]>[0]) =>
        prisma.webhookEndpoint.findMany(mergeAccountId(accountId, args ?? {}) as never),
      findFirst: (args: Parameters<PrismaClient["webhookEndpoint"]["findFirst"]>[0]) =>
        prisma.webhookEndpoint.findFirst(mergeAccountId(accountId, args ?? {}) as never),
      findUnique: prisma.webhookEndpoint.findUnique.bind(prisma.webhookEndpoint),
      create: prisma.webhookEndpoint.create.bind(prisma.webhookEndpoint),
      update: prisma.webhookEndpoint.update.bind(prisma.webhookEndpoint),
      updateMany: (args: Parameters<PrismaClient["webhookEndpoint"]["updateMany"]>[0]) =>
        prisma.webhookEndpoint.updateMany(mergeAccountId(accountId, args ?? {}) as never),
      delete: prisma.webhookEndpoint.delete.bind(prisma.webhookEndpoint),
      deleteMany: (args: Parameters<PrismaClient["webhookEndpoint"]["deleteMany"]>[0]) =>
        prisma.webhookEndpoint.deleteMany(mergeAccountId(accountId, args ?? {}) as never),
    },
  };

  return {
    ...prisma,
    ...scope,
  } as unknown as PrismaClient;
}
