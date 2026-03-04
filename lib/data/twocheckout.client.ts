/**
 * Data layer: 2Checkout payment links and IPN verification. Pure I/O.
 */

import { createHash } from "crypto";

const SECRET_WORD = process.env.TWOCO_SECRET_WORD ?? "";

export type PlanSlug = "Starter" | "Professional" | "Enterprise" | "Growth" | "Business";

export function getPaymentLinkUrl(
  plan: PlanSlug,
  accountId: string,
  returnUrl: string
): string {
  const base =
    plan === "Starter"
      ? process.env.TWOCO_LINK_STARTER
      : plan === "Professional" || plan === "Growth"
        ? (process.env.TWOCO_LINK_PROFESSIONAL ?? process.env.TWOCO_LINK_GROWTH)
        : (process.env.TWOCO_LINK_ENTERPRISE ?? process.env.TWOCO_LINK_BUSINESS);
  if (!base) return "";
  const url = new URL(base);
  url.searchParams.set("return_url", returnUrl);
  url.searchParams.set("merchant_order_id", accountId);
  url.searchParams.set("external_reference", accountId);
  return url.toString();
}

export function verifyIPNSignature(params: Record<string, string | undefined>): boolean {
  if (!SECRET_WORD) return false;
  const receivedHash = params.MD5_HASH ?? params.HMAC ?? "";
  if (!receivedHash) return false;
  const merchantSid = params.MERCHANT_ORDER_ID ?? params.ORDERNO ?? "";
  const orderNumber = params.ORDERNO ?? params.ORDER_NUMBER ?? "";
  const total = params.TOTAL ?? params.ORDER_TOTAL ?? "";
  const toHash = SECRET_WORD + merchantSid + orderNumber + total;
  const expected = createHash("md5").update(toHash).digest("hex").toUpperCase();
  return receivedHash.toUpperCase() === expected;
}

export function isIPNSuccess(params: Record<string, string | undefined>): boolean {
  const msg = params.MESSAGE_TYPE ?? params.ORDER_STATUS ?? "";
  const status = (params.STATUS ?? params.ORDER_STATUS ?? "").toUpperCase();
  return (
    msg === "ORDER_CREATED" ||
    msg === "COMPLETE" ||
    status === "COMPLETE" ||
    status === "APPROVED" ||
    status === "AUTH"
  );
}
