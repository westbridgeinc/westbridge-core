import { describe, it, expect } from "vitest";
import { G_KEYS } from "./useKeyboardShortcuts";

describe("useKeyboardShortcuts G_KEYS", () => {
  const EXPECTED_KEYS = ["d", "i", "a", "e", "c", "q", "n", "p", "h", "r", "y", "s"];

  it("defines href for each expected shortcut key", () => {
    for (const key of EXPECTED_KEYS) {
      expect(G_KEYS[key]).toBeDefined();
      expect(typeof G_KEYS[key]).toBe("string");
    }
  });

  it("all hrefs are dashboard routes", () => {
    for (const key of Object.keys(G_KEYS)) {
      expect(G_KEYS[key].startsWith("/dashboard")).toBe(true);
    }
  });

  it("maps d to dashboard root and s to settings", () => {
    expect(G_KEYS.d).toBe("/dashboard");
    expect(G_KEYS.s).toBe("/dashboard/settings");
  });
});
