import { NextResponse } from "next/server";
import { checkRateLimit, getClientIdentifier } from "@/lib/ratelimit";
import {
  verifyIPN,
  isPaymentSuccess,
  markAccountPaid,
} from "@/lib/services/billing.service";
import { logAction } from "@/lib/services/audit.service";
import { RATE_LIMIT } from "@/lib/constants";

export async function POST(request: Request) {
  const id = getClientIdentifier(request);
  const { allowed } = await checkRateLimit(`webhook:2co:${id}`, RATE_LIMIT.WEBHOOK_2CO_PER_MINUTE);
  if (!allowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
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
    return new NextResponse("Bad Request", { status: 400 });
  }

  if (!verifyIPN(paramsRecord)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  if (!isPaymentSuccess(paramsRecord)) {
    return new NextResponse("OK", { status: 200 });
  }

  const accountId = paramsRecord.MERCHANT_ORDER_ID ?? paramsRecord.EXTERNAL_REFERENCE ?? paramsRecord.REFNO;
  if (!accountId) {
    return new NextResponse("OK", { status: 200 });
  }

  const result = await markAccountPaid(
    accountId,
    paramsRecord.ORDERNO ?? paramsRecord.ORDER_NUMBER,
    paramsRecord.CUSTOMER_REF
  );

  if (!result.ok) {
    const { logger } = await import("@/lib/logger");
    logger.error("2Checkout webhook markAccountPaid error", { error: result.error });
    return new NextResponse("Error", { status: 500 });
  }

  void logAction({
    accountId,
    action: "payment.activated",
    metadata: {
      orderNo: paramsRecord.ORDERNO ?? paramsRecord.ORDER_NUMBER,
      customerRef: paramsRecord.CUSTOMER_REF,
    },
  });

  return new NextResponse("OK", { status: 200 });
}
