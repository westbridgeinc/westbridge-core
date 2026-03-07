import { NextResponse } from "next/server";
import { checkTieredRateLimit, getClientIdentifier, rateLimitHeaders } from "@/lib/api/rate-limit-tiers";
import {
  verifyIPN,
  isPaymentSuccess,
  markAccountPaid,
} from "@/lib/services/billing.service";
import { logAudit, auditContext } from "@/lib/services/audit.service";
import { securityHeaders } from "@/lib/security-headers";

export async function POST(request: Request) {
  const start = Date.now();
  const headers = () => ({ ...securityHeaders(), "X-Response-Time": `${Date.now() - start}ms` });
  const ctx = auditContext(request);
  const id = getClientIdentifier(request);
  const rateLimit = await checkTieredRateLimit(id, "anonymous", "/api/webhooks/2checkout");
  if (!rateLimit.allowed) {
    const systemAccountId = process.env.SYSTEM_ACCOUNT_ID;
    if (systemAccountId) {
      void logAudit({
        accountId: systemAccountId,
        action: "payment.webhook.rate_limited",
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        severity: "warn",
        outcome: "failure",
      });
    }
    return new NextResponse("Too Many Requests", { status: 429, headers: { ...headers(), ...rateLimitHeaders(rateLimit) } });
  }

  let paramsRecord: Record<string, string | undefined> = {};
  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      paramsRecord = Object.fromEntries(new URLSearchParams(text)) as Record<string, string | undefined>;
    } else {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        paramsRecord[key] = typeof value === "string" ? value : undefined;
      });
    }
  } catch {
    return new NextResponse("Bad Request", { status: 400, headers: headers() });
  }

  if (!verifyIPN(paramsRecord)) {
    const systemAccountId = process.env.SYSTEM_ACCOUNT_ID;
    if (systemAccountId) {
      void logAudit({
        accountId: systemAccountId,
        action: "payment.webhook.invalid_signature",
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        severity: "critical",
        outcome: "failure",
      });
    }
    return new NextResponse("Invalid signature", { status: 401, headers: headers() });
  }

  if (!isPaymentSuccess(paramsRecord)) {
    return new NextResponse("OK", { status: 200, headers: headers() });
  }

  const accountId = paramsRecord.MERCHANT_ORDER_ID ?? paramsRecord.EXTERNAL_REFERENCE ?? paramsRecord.REFNO;
  if (!accountId) {
    return new NextResponse("OK", { status: 200, headers: headers() });
  }

  const result = await markAccountPaid(
    accountId,
    paramsRecord.ORDERNO ?? paramsRecord.ORDER_NUMBER,
    paramsRecord.CUSTOMER_REF
  );

  if (!result.ok) {
    const { logger } = await import("@/lib/logger");
    logger.error("2Checkout webhook markAccountPaid error", { error: result.error });
    return new NextResponse("Error", { status: 500, headers: headers() });
  }

  void logAudit({
    accountId,
    action: "payment.webhook.success",
    metadata: {
      orderNo: paramsRecord.ORDERNO ?? paramsRecord.ORDER_NUMBER,
      customerRef: paramsRecord.CUSTOMER_REF,
    },
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
    severity: "info",
    outcome: "success",
  });

  return new NextResponse("OK", { status: 200, headers: headers() });
}
