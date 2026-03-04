/**
 * 2Checkout (Verifone) integration for Guyana and Caribbean.
 * Uses payment links (created in 2Checkout dashboard) + IPN webhook.
 */

import { createHash } from "crypto";

const MERCHANT_CODE = process.env.TWOCO_MERCHANT_CODE ?? "";
const SECRET_WORD = process.env.TWOCO_SECRET_WORD ?? "";

/** Plan-specific payment links from 2Checkout dashboard (Setup → Generate links). */
export function getPaymentLink(plan: "Starter" | "Professional" | "Enterprise" | "Growth" | "Business", accountId: string, returnUrl: string): string {
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

/**
 * Verify 2Checkout IPN (Instant Payment Notification) signature.
 * They send MD5_HASH (legacy) or HMAC. Docs: https://verifone.cloud/docs/2checkout/API-Integration/Webhooks/06Instant_Payment_Notification_IPN
 */
export function verifyIPNSignature(params: Record<string, string | undefined>): boolean {
  if (!SECRET_WORD) return false;
  const receivedHash = params.MD5_HASH ?? params.HMAC ?? "";
  if (!receivedHash) return false;

  // 2Checkout IPN: MD5_HASH = md5(secret_word + merchant_sid + order_number + total)
  const merchantSid = params.MERCHANT_ORDER_ID ?? params.ORDERNO ?? "";
  const orderNumber = params.ORDERNO ?? params.ORDER_NUMBER ?? "";
  const total = params.TOTAL ?? params.ORDER_TOTAL ?? "";
  const toHash = SECRET_WORD + merchantSid + orderNumber + total;
  const expected = createHash("md5").update(toHash).digest("hex").toUpperCase();
  return receivedHash.toUpperCase() === expected;
}

/** IPN message type for order completion. */
export function isSuccessfulPayment(params: Record<string, string | undefined>): boolean {
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

export function is2CheckoutConfigured(): boolean {
  return Boolean(MERCHANT_CODE && SECRET_WORD);
}
