/**
 * Billing service: signup (create account + payment link), IPN handling.
 */

import { prisma } from "@/lib/data/prisma";
import {
  getPaymentLinkUrl,
  verifyIPNSignature,
  isIPNSuccess,
  type PlanSlug,
} from "@/lib/data/twocheckout.client";
import { ok, type Result } from "@/lib/utils/result";

const VALID_PLANS: PlanSlug[] = ["Starter", "Professional", "Enterprise", "Growth", "Business"];

export interface CreateAccountInput {
  email: string;
  companyName: string;
  plan: string;
  modulesSelected?: string[];
}

export interface CreateAccountResult {
  accountId: string;
  paymentUrl: string | null;
  status: "pending";
  message?: string;
}

export async function createAccount(
  input: CreateAccountInput,
  returnBaseUrl: string
): Promise<Result<CreateAccountResult, string>> {
  const { email, companyName, plan, modulesSelected } = input;
  if (!email?.trim() || !companyName?.trim() || !plan?.trim()) {
    return { ok: false, error: "Email, company name, and plan are required" };
  }
  const planSlug = plan as PlanSlug;
  if (!VALID_PLANS.includes(planSlug)) {
    return { ok: false, error: "Invalid plan" };
  }

  const existing = await prisma.account.findUnique({ where: { email: email.trim() } });
  if (existing) {
    if (existing.status === "active") {
      return { ok: false, error: "An account with this email already exists. Please sign in." };
    }
    await prisma.account.delete({ where: { email: email.trim() } });
  }

  const account = await prisma.account.create({
    data: {
      email: email.trim(),
      companyName: companyName.trim(),
      plan: planSlug,
      modulesSelected: Array.isArray(modulesSelected) ? modulesSelected : [],
      status: "pending",
    },
  });

  const returnUrl = `${returnBaseUrl}/signup?success=true&accountId=${account.id}`;
  const paymentUrl = getPaymentLinkUrl(planSlug, account.id, returnUrl);

  return {
    ok: true,
    data: {
      accountId: account.id,
      paymentUrl: paymentUrl || null,
      status: "pending",
      ...(paymentUrl ? {} : { message: "Account created. Payment link not configured; contact support to complete." }),
    },
  };
}

export interface HandleIPNResult {
  updated: boolean;
  accountId?: string;
}

export function verifyIPN(params: Record<string, string | undefined>): boolean {
  return verifyIPNSignature(params);
}

export function isPaymentSuccess(params: Record<string, string | undefined>): boolean {
  return isIPNSuccess(params);
}

export async function markAccountPaid(
  accountId: string,
  twocoOrderId?: string,
  twocoCustomerId?: string
): Promise<Result<HandleIPNResult, string>> {
  const result = await prisma.account.updateMany({
    where: { id: accountId },
    data: {
      status: "active",
      twocoOrderId: twocoOrderId ?? undefined,
      twocoCustomerId: twocoCustomerId ?? undefined,
    },
  });
  return ok({
    updated: (result.count ?? 0) > 0,
    accountId,
  });
}
