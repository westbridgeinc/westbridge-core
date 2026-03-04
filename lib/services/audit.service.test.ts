import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();
vi.mock("@/lib/data/prisma", () => ({
  prisma: {
    auditLog: { create: createMock },
  },
}));

describe("audit.service", () => {
  beforeEach(() => {
    createMock.mockReset();
    createMock.mockResolvedValue({});
  });

  it("calls prisma.auditLog.create with correct shape", async () => {
    const { logAction } = await import("./audit.service");
    await logAction({
      accountId: "acc-1",
      userId: "user-1",
      action: "login",
      ipAddress: "127.0.0.1",
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        accountId: "acc-1",
        userId: "user-1",
        action: "login",
        resource: undefined,
        resourceId: undefined,
        metadata: undefined,
        ipAddress: "127.0.0.1",
      },
    });
  });

  it("supports optional resource and metadata", async () => {
    const { logAction } = await import("./audit.service");
    await logAction({
      accountId: "acc-2",
      action: "invoice.create",
      resource: "Sales Invoice",
      resourceId: "SINV-001",
      metadata: { amount: 1000 },
    });
    expect(createMock).toHaveBeenCalledWith({
      data: {
        accountId: "acc-2",
        userId: undefined,
        action: "invoice.create",
        resource: "Sales Invoice",
        resourceId: "SINV-001",
        metadata: { amount: 1000 },
        ipAddress: undefined,
      },
    });
  });
});
