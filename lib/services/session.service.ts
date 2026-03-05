/**
 * Session service: create, validate, revoke. Tokens are hashed (SHA-256) before storage.
 */

import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/data/prisma";
import type { Result } from "@/lib/utils/result";
import { ok, err } from "@/lib/utils/result";
const SESSION_EXPIRY_DAYS = 7;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0]?.trim() ?? null : null;
}

function getUserAgent(request: Request): string | null {
  return request.headers.get("user-agent") ?? null;
}

/**
 * Create a new session for the user. Returns the raw token (to set in cookie); only hash is stored.
 */
export async function createSession(
  userId: string,
  request: Request,
  erpnextSid?: string | null
): Promise<Result<{ token: string; expiresAt: Date }, string>> {
  const raw = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  try {
    await prisma.session.create({
      data: {
        userId,
        token: tokenHash,
        erpnextSid: erpnextSid ?? undefined,
        ipAddress: getIp(request),
        userAgent: getUserAgent(request),
        expiresAt,
      },
    });
    return ok({ token: raw, expiresAt });
  } catch (e) {
    return err(e instanceof Error ? e.message : "Failed to create session");
  }
}

export type SessionRole = "owner" | "admin" | "member";

/**
 * Validate session token. Returns userId, accountId, role; optionally erpnextSid for ERP proxy.
 * Deletes expired sessions on miss.
 */
export async function validateSession(
  token: string
): Promise<Result<{ userId: string; accountId: string; role: SessionRole; erpnextSid?: string | null }, string>> {
  if (!token?.trim()) return err("Missing token");
  const tokenHash = hashToken(token);

  try {
    const session = await prisma.session.findUnique({
      where: { token: tokenHash },
      include: { user: { include: { account: true } } },
    });
    if (!session) {
      await deleteExpiredSessions();
      return err("Invalid session");
    }
    if (session.expiresAt <= new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return err("Session expired");
    }
    const role = (session.user.role === "owner" || session.user.role === "admin" || session.user.role === "member")
      ? session.user.role
      : "member";
    return ok({
      userId: session.userId,
      accountId: session.user.accountId,
      role,
      erpnextSid: session.erpnextSid ?? undefined,
    });
  } catch (e) {
    return err(e instanceof Error ? e.message : "Session validation failed");
  }
}

async function deleteExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});
}

/**
 * Revoke a session by token (e.g. on logout).
 */
export async function revokeSession(token: string): Promise<Result<{ revoked: boolean }, string>> {
  if (!token?.trim()) return ok({ revoked: false });
  const tokenHash = hashToken(token);
  try {
    const deleted = await prisma.session.deleteMany({ where: { token: tokenHash } });
    return ok({ revoked: deleted.count > 0 });
  } catch {
    return ok({ revoked: false });
  }
}

/**
 * Revoke all sessions for a user (e.g. security action).
 */
export async function revokeAllUserSessions(userId: string): Promise<Result<{ count: number }, string>> {
  try {
    const result = await prisma.session.deleteMany({ where: { userId } });
    return ok({ count: result.count });
  } catch (e) {
    return err(e instanceof Error ? e.message : "Failed to revoke sessions");
  }
}
