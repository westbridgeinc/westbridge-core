/**
 * GET /api/usage — current billing period usage for the authenticated account.
 * Uses the shared API pipeline (auth, rate limit, permission, headers).
 */
import { NextResponse } from "next/server";
import {
  createPipeline,
  withRequestId,
  withTracing,
  withRateLimit,
  withAuth,
  withPermission,
  withResponseTime,
} from "@/lib/api/pipeline";
import { meter, estimateAiCost } from "@/lib/metering";
import { prisma } from "@/lib/data/prisma";
import { apiSuccess, apiError, apiMeta } from "@/types/api";

const PLAN_USER_LIMITS: Record<string, number | null> = {
  Starter: 5,
  Growth: 25,
  Business: null,
};

async function usageHandler(ctx: import("@/lib/api/pipeline").PipelineContext): Promise<NextResponse> {
  const session = ctx.session!;
  const meta = () => apiMeta({ request_id: ctx.requestId });

  try {
    const [usage, account] = await Promise.all([
      meter.get(session.accountId),
      prisma.account.findUnique({
        where: { id: session.accountId },
        select: { plan: true, users: { select: { id: true } } },
      }),
    ]);

    const plan = account?.plan ?? "Starter";
    const userLimit = PLAN_USER_LIMITS[plan] ?? null;
    const aiCostUsd = estimateAiCost(usage.ai_tokens_input, usage.ai_tokens_output);

    return NextResponse.json(
      apiSuccess(
        {
          period: usage.period,
          plan,
          usage: {
            api_calls: { count: usage.api_calls, limit: null },
            erp_docs_created: { count: usage.erp_docs_created, limit: null },
            active_users: { count: usage.active_users_count, limit: userLimit },
            ai_tokens: {
              input: usage.ai_tokens_input,
              output: usage.ai_tokens_output,
              cost_usd: Math.round(aiCostUsd * 100) / 100,
            },
          },
        },
        meta()
      )
    );
  } catch {
    return NextResponse.json(
      apiError("SERVER_ERROR", "An unexpected error occurred", undefined, meta()),
      { status: 500 }
    );
  }
}

export const GET = createPipeline(
  [
    withRequestId,
    withTracing,
    withRateLimit({ tier: "authenticated" }),
    withAuth,
    withPermission("billing:read"),
    withResponseTime,
  ],
  usageHandler
);
