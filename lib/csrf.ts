import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { COOKIE } from "@/lib/constants";

const CSRF_HEADER = "x-csrf-token";
const CSRF_MAX_AGE = 60 * 60; // 1 hour

export const CSRF_COOKIE_NAME = COOKIE.CSRF_NAME;

function getSecret(): string {
  const s = process.env.CSRF_SECRET;
  if (!s) throw new Error("CSRF_SECRET environment variable is required");
  return s;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

/**
 * Generate a CSRF token (HMAC of random value so we can verify it wasn't tampered).
 */
export function generateCsrfToken(): string {
  const secret = getSecret();
  const value = randomBytes(24).toString("base64url");
  const signature = createHash("sha256").update(`${secret}:${value}`).digest("base64url").slice(0, 24);
  return `${value}.${signature}`;
}

/**
 * Verify token format and signature. Returns true if valid.
 */
export function verifyCsrfToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const [value, signature] = token.split(".");
  if (!value || !signature) return false;
  const secret = getSecret();
  const expected = createHash("sha256").update(`${secret}:${value}`).digest("base64url").slice(0, 24);
  return safeEqual(signature, expected);
}

/**
 * Validate CSRF: token from header must match cookie and pass signature check.
 * Pass the cookie value from cookies().get(CSRF_COOKIE_NAME)?.value.
 */
export function validateCsrf(headerToken: string | null, cookieToken: string | null | undefined): boolean {
  if (!headerToken || !cookieToken) return false;
  if (!safeEqual(headerToken, cookieToken)) return false;
  return verifyCsrfToken(headerToken);
}

export const CSRF_HEADER_NAME = CSRF_HEADER;
export const CSRF_MAX_AGE_SECONDS = CSRF_MAX_AGE;
