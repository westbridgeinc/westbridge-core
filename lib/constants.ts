/**
 * Application constants. No magic numbers or strings in components or services.
 */

export const HTTP = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

export const RATE_LIMIT = {
  LOGIN_PER_MINUTE: 10,
  SIGNUP_PER_MINUTE: 5,
  WEBHOOK_2CO_PER_MINUTE: 100,
} as const;

export const COOKIE = {
  SESSION_MAX_AGE_SEC: 60 * 60 * 24 * 7, // 7 days
  CSRF_NAME: "westbridge_csrf",
  SESSION_NAME: "westbridge_sid",
  ACCOUNT_ID_NAME: "westbridge_account_id",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;

/** Caribbean / Guyana defaults */
export const LOCALE = {
  DEFAULT_CURRENCY: "GYD" as const,
  DEFAULT_TIMEZONE: "America/Guyana",
  DATE_FORMAT: "DD/MM/YYYY",
  VAT_RATE_GUYANA: 0.14, // 14%
} as const;

export const CURRENCY_CODES = ["GYD", "USD", "TTD", "BBD", "XCD", "JMD"] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/** Display conversion rate for pricing (e.g. 1 USD = 210 GYD). Update from API in production. */
export const DISPLAY_RATE_USD_TO_GYD = 210;
