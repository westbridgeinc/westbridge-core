/**
 * Site-wide constants. No magic strings in pages or components.
 */

export const SITE = {
  name: "Westbridge",
  wordmark: "WESTBRIDGE",
  legal: "INC.",
  tagline: "Enterprise intelligence for the Caribbean",
  domain: "westbridge.gy",
  appDomain: "app.westbridge.gy",
  /** Path to main logo (black/white mark + wordmark). Use in Navbar, Sidebar, Login. */
  logoPath: "/images/logo.png",
  /** Favicon (same logo, or use logoPath in metadata). */
  faviconPath: "/images/logo.png",
} as const;

export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  modules: "/modules",
  about: "/about",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  terms: "/terms",
  privacy: "/privacy",
} as const;

export const TRIAL = {
  days: 14,
  noCardRequired: true,
} as const;

/** Display currency for marketing (pricing). GYD default, USD toggle. */
export const CURRENCY = {
  primary: "USD",
  defaultDisplay: "GYD" as const,
  label: "USD",
  /** For Caribbean localization: GYD default with USD toggle */
  supported: ["GYD", "USD"] as const,
} as const;
