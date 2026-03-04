import { NextResponse } from "next/server";
import { validateEnv, getEnvSummary } from "@/lib/env";
import { prisma } from "@/lib/data/prisma";
import { getRequestId } from "@/types/api";
import { apiMeta } from "@/types/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/health — production health check.
 * Returns 200 if the app can run; 503 if critical deps (DB) are down.
 */
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const envCheck = validateEnv();

  let dbOk = false;
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    dbOk = true;
  } catch (error) {
    const { logger } = await import("@/lib/logger");
    logger.error("Health check DB failure", {
      error: error instanceof Error ? error.message : String(error),
      request_id: requestId,
    });
  }

  const healthy = envCheck.ok && dbOk;
  const status = healthy ? 200 : 503;

  const body: Record<string, unknown> = {
    status: healthy ? "ok" : "degraded",
    checks: {
      env: envCheck.ok,
      envMissing: envCheck.ok ? undefined : (envCheck as { missing: string[] }).missing,
      database: dbOk,
    },
    meta: apiMeta({ request_id: requestId }),
  };
  if (process.env.NODE_ENV !== "production") {
    body.env = getEnvSummary();
  }

  return NextResponse.json(body, { status });
}
