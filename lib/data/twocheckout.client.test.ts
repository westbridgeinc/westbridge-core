import { describe, it, expect, vi, beforeAll } from "vitest";

describe("twocheckout.client", () => {
  beforeAll(async () => {
    process.env.TWOCO_SECRET_WORD = "s";
    process.env.TWOCO_LINK_STARTER = "https://pay.test/s";
    vi.resetModules();
  });
  it("getPaymentLinkUrl returns URL", async () => {
    const { getPaymentLinkUrl } = await import("./twocheckout.client");
    const url = getPaymentLinkUrl("Starter", "acc1", "https://r.com");
    expect(url).toContain("return_url");
  });
  it("isIPNSuccess", async () => {
    const { isIPNSuccess } = await import("./twocheckout.client");
    expect(isIPNSuccess({ MESSAGE_TYPE: "ORDER_CREATED" })).toBe(true);
  });
});
