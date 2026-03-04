import { describe, it, expect, vi, beforeEach } from "vitest";

const findUniqueMock = vi.fn();
const deleteMock = vi.fn();
const createMock = vi.fn();
vi.mock("@/lib/data/prisma", () => ({
  prisma: {
    account: {
      findUnique: findUniqueMock,
      delete: deleteMock,
      create: createMock,
    },
  },
}));

const getPaymentLinkUrlMock = vi.fn();
vi.mock("@/lib/data/twocheckout.client", () => ({
  getPaymentLinkUrl: getPaymentLinkUrlMock,
  verifyIPNSignature: vi.fn(() => true),
  isIPNSuccess: vi.fn(() => false),
}));

describe("billing.service", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    deleteMock.mockReset();
    createMock.mockReset();
    getPaymentLinkUrlMock.mockReset();
    getPaymentLinkUrlMock.mockReturnValue("https://checkout.example/pay");
  });

  it("returns error when email is missing", async () => {
    const { createAccount } = await import("./billing.service");
    const result = await createAccount(
      { email: "", companyName: "Acme", plan: "Starter" },
      "http://localhost:3000"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("required");
  });

  it("returns error for invalid plan", async () => {
    const { createAccount } = await import("./billing.service");
    const result = await createAccount(
      { email: "a@b.com", companyName: "Acme", plan: "InvalidPlan" },
      "http://localhost:3000"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("Invalid plan");
  });

  it("returns error when account with email already exists and is active", async () => {
    findUniqueMock.mockResolvedValue({ id: "acc-1", email: "a@b.com", status: "active" });
    const { createAccount } = await import("./billing.service");
    const result = await createAccount(
      { email: "a@b.com", companyName: "Acme", plan: "Starter" },
      "http://localhost:3000"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("already exists");
  });

  it("creates account with valid input", async () => {
    findUniqueMock.mockResolvedValue(null);
    createMock.mockResolvedValue({
      id: "acc-new",
      email: "new@b.com",
      companyName: "New Co",
      plan: "Starter",
      status: "pending",
    });
    const { createAccount } = await import("./billing.service");
    const result = await createAccount(
      { email: "new@b.com", companyName: "New Co", plan: "Starter" },
      "http://localhost:3000"
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.accountId).toBe("acc-new");
      expect(result.data.status).toBe("pending");
    }
    expect(createMock).toHaveBeenCalledWith({
      data: {
        email: "new@b.com",
        companyName: "New Co",
        plan: "Starter",
        modulesSelected: [],
        status: "pending",
      },
    });
  });
});
