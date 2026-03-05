import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"],
    environmentMatchGlobs: [["**/hooks/**/*.test.{ts,tsx}", "jsdom"]],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "lcov"],
      include: ["lib/**/*.ts", "types/**/*.ts"],
      exclude: [
        "lib/generated/**",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/types/**/*.d.ts",
      ],
      lines: 78,
      functions: 78,
      statements: 78,
      branches: 58,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
