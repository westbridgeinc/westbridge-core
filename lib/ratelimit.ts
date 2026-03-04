/**
 * Rate limiter using Redis (INCR + EXPIRE). Falls back to allowing the request and logging a warning if Redis is unavailable.
 */

import { getRedis } from "@/lib/redis";

const WINDOW_MS = 60 * 1000; // 1 minute

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() : null;
  return ip ?? request.headers.get("x-real-ip") ?? "anonymous";
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number = WINDOW_MS
): Promise<{ allowed: boolean; remaining: number }> {
  const client = getRedis();
  if (!client) {
    const { logger } = await import("@/lib/logger");
    logger.warn("Rate limit: Redis unavailable, allowing request");
    return { allowed: true, remaining: maxRequests };
  }

  const redisKey = `ratelimit:${key}`;
  try {
    const count = await client.incr(redisKey);
    if (count === 1) await client.pexpire(redisKey, windowMs);
    const allowed = count <= maxRequests;
    const remaining = Math.max(0, maxRequests - count);
    return { allowed, remaining };
  } catch (e) {
    const { logger } = await import("@/lib/logger");
    logger.warn("Rate limit: Redis error, allowing request", { error: e instanceof Error ? e.message : String(e) });
    return { allowed: true, remaining: maxRequests };
  }
}
