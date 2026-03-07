import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();
const loggerErrorMock = vi.fn();
vi.mock("@/lib/data/prisma", () => ({
  prisma: {
    auditLog: { create: createMock },
  },
}));
vi.mock("@/lib/logger", () => ({
  logger: { error: loggerErrorMock, warn: vi.fn(), info: vi.fn() },
}));

describe("audit.service", () => {
  beforeEach(() => {
    createMock.mockReset();
    createMock.mockResolvedValue({});
  });

  it("calls prisma.auditLog.create with logAudit shape", async () => {
    const { logAudit } = await import("./audit.service");
    await logAudit({
      accountId: "acc-1",
      userId: "user-1",
      action: "auth.login.success",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        accountId: "acc-1",
        userId: "user-1",
        action: "auth.login.success",
        resource: undefined,
        resourceId: undefined,
        metadata: undefined,
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0",
        severity: "info",
        outcome: "success",
      },
    });
  });

  it("supports optional resource, metadata, severity, outcome", async () => {
    const { logAudit } = await import("./audit.service");
    await logAudit({
      accountId: "acc-2",
      action: "erp.doc.create",
      resource: "Sales Invoice",
      resourceId: "SINV-001",
      metadata: { amount: 1000 },
      severity: "warn",
      outcome: "failure",
    });
    expect(createMock).toHaveBeenCalledWith({
      data: {
        accountId: "acc-2",
        userId: undefined,
        action: "erp.doc.create",
        resource: "Sales Invoice",
        resourceId: "SINV-001",
        metadata: { amount: 1000 },
        ipAddress: undefined,
        userAgent: undefined,
        severity: "warn",
        outcome: "failure",
      },
    });
  });

  it("logs error when prisma.auditLog.create rejects", async () => {
    loggerErrorMock.mockClear();
    createMock.mockRejectedValueOnce(new Error("DB error"));
    const { logAudit } = await import("./audit.service");
    await logAudit({ accountId: "acc-3", action: "auth.login.failure", ipAddress: "1.2.3.4" });
    expect(loggerErrorMock).toHaveBeenCalledWith(
      "audit_log_write_failed",
      expect.objectContaining({ action: "auth.login.failure" })
    );
  });

  it("auditContext extracts ip and userAgent from request", async () => {
    const { auditContext } = await import("./audit.service");
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": " 1.2.3.4 , 5.6.7.8", "user-agent": "TestAgent" },
    });
    expect(auditContext(req)).toEqual({ ipAddress: "1.2.3.4", userAgent: "TestAgent" });
  });
});
