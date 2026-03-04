import { MODULE_ROWS, isModuleIncludedInPlan, getAddOnPrice } from "@/lib/modules";
import type { PlanId } from "@/lib/modules";
import { PricingCards } from "./pricing-cards";

function cellContent(moduleId: string, planId: PlanId): string {
  if (isModuleIncludedInPlan(moduleId, planId)) return "✓";
  const addOn = getAddOnPrice(moduleId, planId);
  if (addOn != null) return `+$${addOn}`;
  return "—";
}

export const metadata = {
  title: "Pricing | Westbridge",
  description: "Simple, transparent pricing. Per user, per month. Add modules as you grow.",
  openGraph: {
    title: "Pricing | Westbridge",
    description: "Simple, transparent pricing. Per user, per month. Add modules as you grow.",
  },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[var(--max-width)] px-[var(--space-container)] py-[var(--space-section-y)]">
      <h1 className="text-h1 text-center font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
        Simple, transparent pricing
      </h1>
      <p className="mt-3 text-center text-body" style={{ color: "var(--color-ink-secondary)" }}>
        Per user, per month. Add modules as you grow.
      </p>

      <PricingCards />

      <p className="mt-8 text-center text-caption">
        Add-on modules: $8–15/mo each for Starter and Professional. Enterprise includes all 38 modules.
      </p>
      <p className="mt-2 text-center text-caption" style={{ color: "var(--color-ink-tertiary)" }}>
        Payment is processed securely via 2Checkout (Verifone) — cards and local payment methods accepted.
      </p>

      <div className="mt-16 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--color-border-subtle)", background: "var(--color-ground)" }}>
        <table className="w-full min-w-[600px] border-collapse text-body">
          <thead>
            <tr style={{ background: "var(--color-ground-section)", borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="py-4 pl-6 text-left text-label" style={{ color: "var(--color-ink-tertiary)" }}>Module</th>
              <th className="py-4 px-4 text-center text-label" style={{ color: "var(--color-ink-tertiary)" }}>Starter</th>
              <th className="py-4 px-4 text-center text-label" style={{ color: "var(--color-ink-tertiary)" }}>Professional</th>
              <th className="py-4 px-4 text-center text-label" style={{ color: "var(--color-ink-tertiary)" }}>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {MODULE_ROWS.map((row, index) => {
              const showCategory = index === 0 || row.category !== MODULE_ROWS[index - 1].category;
              return (
                <tr
                  key={row.moduleId}
                  className="transition-colors hover:bg-[var(--color-ground-section)]"
                  style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
                >
                  <td className="py-3 pl-6">
                    {showCategory && (
                      <span className="mb-1 block text-label" style={{ color: "var(--color-ink-tertiary)" }}>
                        {row.category}
                      </span>
                    )}
                    <span className="font-medium" style={{ color: "var(--color-ink)" }}>{row.module}</span>
                  </td>
                  <td className="py-3 px-4 text-center" style={{ color: "var(--color-ink-secondary)" }}>
                    {cellContent(row.moduleId, "starter")}
                  </td>
                  <td className="py-3 px-4 text-center" style={{ color: "var(--color-ink-secondary)" }}>
                    {cellContent(row.moduleId, "professional")}
                  </td>
                  <td className="py-3 px-4 text-center" style={{ color: "var(--color-ink-secondary)" }}>
                    {cellContent(row.moduleId, "enterprise")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
