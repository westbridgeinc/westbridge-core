import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  timeout: 30_000,
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Use a separate tsconfig that targets CommonJS so that Node.js can load
  // the Prisma generated client (which uses CJS runtime internals) without
  // hitting "exports is not defined in ES module scope" errors.
  tsconfig: "./tsconfig.e2e.json",
});
