import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock pino before importing logger so we always get the production JSON path,
// regardless of NODE_ENV in the test runner.
vi.mock("pino", () => {
  const writes: { level: string; msg: string; [k: string]: unknown }[] = [];
  const makeLogger = (ctx?: Record<string, unknown>) => ({
    trace: (c: Record<string, unknown>, msg: string) => writes.push({ level: "trace", ...ctx, ...c, msg }),
    debug: (c: Record<string, unknown>, msg: string) => writes.push({ level: "debug", ...ctx, ...c, msg }),
    info:  (c: Record<string, unknown>, msg: string) => writes.push({ level: "info",  ...ctx, ...c, msg }),
    warn:  (c: Record<string, unknown>, msg: string) => writes.push({ level: "warn",  ...ctx, ...c, msg }),
    error: (c: Record<string, unknown>, msg: string) => writes.push({ level: "error", ...ctx, ...c, msg }),
    fatal: (c: Record<string, unknown>, msg: string) => writes.push({ level: "fatal", ...ctx, ...c, msg }),
    child: (c: Record<string, unknown>) => makeLogger({ ...ctx, ...c }),
  });
  const pino = () => makeLogger();
  (pino as unknown as { stdTimeFunctions: unknown }).stdTimeFunctions = { isoTime: () => "" };
  // Expose the writes array so tests can inspect it
  (pino as unknown as { _writes: typeof writes })._writes = writes;
  return { default: pino };
});

// Import logger AFTER mocking pino
const { logger } = await import("./logger");
// Access the write buffer
import pino from "pino";
const writes = (pino as unknown as { _writes: { level: string; msg: string; [k: string]: unknown }[] })._writes;

describe("logger", () => {
  beforeEach(() => {
    writes.length = 0;
  });

  afterEach(() => {
    writes.length = 0;
  });

  it("logger.error records an error entry", () => {
    logger.error("fail");
    expect(writes).toHaveLength(1);
    expect(writes[0].level).toBe("error");
    expect(writes[0].msg).toBe("fail");
  });

  it("logger.warn records a warn entry", () => {
    logger.warn("warn msg");
    expect(writes).toHaveLength(1);
    expect(writes[0].level).toBe("warn");
  });

  it("logger.info records an info entry", () => {
    logger.info("info msg");
    expect(writes).toHaveLength(1);
    expect(writes[0].level).toBe("info");
  });

  it("includes meta when provided", () => {
    logger.error("e", { requestId: "abc" });
    expect(writes[0].requestId).toBe("abc");
    expect(writes[0].msg).toBe("e");
  });
});
