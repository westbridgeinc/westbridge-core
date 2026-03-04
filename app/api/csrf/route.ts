import { NextResponse } from "next/server";
import { generateCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME, CSRF_MAX_AGE_SECONDS } from "@/lib/csrf";
import { apiSuccess, apiMeta, getRequestId } from "@/types/api";

/**
 * GET /api/csrf — returns a CSRF token and sets it in a cookie.
 * Call before login/signup/mutations; send the token in X-CSRF-Token header on POST.
 */
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const token = generateCsrfToken();
  const res = NextResponse.json(apiSuccess({ token }, apiMeta({ request_id: requestId })));
  res.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // client must read to send in header
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CSRF_MAX_AGE_SECONDS,
    path: "/",
  });
  res.headers.set(CSRF_HEADER_NAME, token);
  return res;
}
