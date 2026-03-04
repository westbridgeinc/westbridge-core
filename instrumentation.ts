/**
 * Runs once when the Next.js server starts. Validates required env so the app fails fast.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { validateEnv } = await import("./lib/env");
  const result = validateEnv();
  if (!result.ok) {
    const msg = `Missing required environment variables: ${result.missing.join(", ")}. Check .env or .env.example.`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    }
    // eslint-disable-next-line no-console
    console.error(msg);
  }
}
