import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIdentifier } from "@/lib/ratelimit";
import { login } from "@/lib/services/auth.service";
import { createSession } from "@/lib/services/session.service";
import { logAction } from "@/lib/services/audit.service";
import { apiSuccess, apiError, apiMeta, getRequestId } from "@/types/api";
import { loginBodySchema } from "@/types/schemas/auth";
import { validateCsrf, CSRF_COOKIE_NAME } from "@/lib/csrf";
import { prisma } from "@/lib/data/prisma";
import { COOKIE } from "@/lib/constants";
import { RATE_LIMIT } from "@/lib/constants";

const LOGIN_LIMIT = RATE_LIMIT.LOGIN_PER_MINUTE;

export async function POST(request: Request) {
  const id = getClientIdentifier(request);
  const { allowed } = await checkRateLimit(`login:${id}`, LOGIN_LIMIT);
  const requestId = getRequestId(request);
  const meta = () => apiMeta({ request_id: requestId });

  if (!allowed) {
    return NextResponse.json(
      apiError("RATE_LIMIT", "Too many attempts. Try again in a minute.", undefined, meta()),
      { status: 429 }
    );
  }

  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  const csrfHeader = request.headers.get("x-csrf-token") ?? request.headers.get("X-CSRF-Token");
  if (!validateCsrf(csrfHeader, csrfCookie)) {
    return NextResponse.json(
      apiError("FORBIDDEN", "Invalid or missing CSRF token.", undefined, meta()),
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      apiError("INVALID_JSON", "Invalid request body", undefined, meta()),
      { status: 400 }
    );
  }

  const parsed = loginBodySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = first.email?.[0] ?? first.password?.[0] ?? "Invalid request";
    return NextResponse.json(
      apiError("VALIDATION_ERROR", message, undefined, meta()),
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const loginResult = await login(email, password);

  if (!loginResult.ok) {
    const { logger } = await import("@/lib/logger");
    logger.warn("Login failed", { error: loginResult.error, request_id: requestId });
    const accountByEmail = await prisma.account.findUnique({ where: { email } }).catch(() => null);
    if (accountByEmail) {
      void logAction({
        accountId: accountByEmail.id,
        action: "login.failed",
        metadata: { email, reason: loginResult.error },
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
      });
    }
    return NextResponse.json(
      apiError("AUTH_FAILED", loginResult.error, undefined, meta()),
      { status: loginResult.error === "Email and password required" ? 400 : 401 }
    );
  }

  const erpnextSid = loginResult.data;
  const account = await prisma.account.findUnique({ where: { email } }).catch(() => null);
  if (!account) {
    return NextResponse.json(
      apiError("AUTH_FAILED", "No Westbridge account found for this email. Sign up first.", undefined, meta()),
      { status: 401 }
    );
  }

  let user = await prisma.user.findUnique({ where: { accountId_email: { accountId: account.id, email } } });
  if (!user) {
    const existingCount = await prisma.user.count({ where: { accountId: account.id } });
    user = await prisma.user.create({
      data: {
        accountId: account.id,
        email,
        name: null,
        role: existingCount === 0 ? "owner" : "member",
        status: "active",
      },
    });
  }

  const sessionResult = await createSession(user.id, request, erpnextSid);
  if (!sessionResult.ok) {
    return NextResponse.json(
      apiError("SESSION_ERROR", sessionResult.error, undefined, meta()),
      { status: 500 }
    );
  }

  const { token, expiresAt } = sessionResult.data;
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));

  void logAction({
    accountId: account.id,
    userId: user.id,
    action: "login",
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
  });

  const response = NextResponse.json(apiSuccess({ success: true }, meta()));
  response.cookies.set(COOKIE.SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  return response;
}
