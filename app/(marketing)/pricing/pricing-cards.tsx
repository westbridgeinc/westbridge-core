"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/modules";
import { ROUTES } from "@/lib/config/site";
import { formatCurrency } from "@/lib/locale/currency";
import type { CurrencyCode } from "@/lib/constants";
import { DISPLAY_RATE_USD_TO_GYD } from "@/lib/constants";

function priceInCurrency(usd: number, currency: CurrencyCode): number {
  if (currency === "USD") return usd;
  return Math.round(usd * DISPLAY_RATE_USD_TO_GYD);
}

export function PricingCards() {
  const [currency, setCurrency] = useState<CurrencyCode>("GYD");
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        <div className="flex rounded-lg border border-[var(--color-border)] p-1" style={{ background: "var(--color-ground-section)" }}>
          <button
            type="button"
            onClick={() => setCurrency("GYD")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              currency === "GYD" ? "bg-[var(--color-ground)] text-[var(--color-ink)] shadow-sm" : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]"
            }`}
          >
            GYD
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              currency === "USD" ? "bg-[var(--color-ground)] text-[var(--color-ink)] shadow-sm" : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]"
            }`}
          >
            USD
          </button>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-body" style={{ color: "var(--color-ink-secondary)" }}>
          <input
            type="checkbox"
            checked={annual}
            onChange={(e) => setAnnual(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--color-border)]"
          />
          <span>Annual billing</span>
          {annual && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: "var(--color-accent-gold)", color: "var(--color-ink)" }}
            >
              2 months free
            </span>
          )}
        </label>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3" style={{ gap: "24px" }}>
        {PLANS.map((plan) => {
          const monthly = priceInCurrency(plan.pricePerUserPerMonth, currency);
          const displayPrice = annual ? Math.round(monthly * 10) : monthly; // 10 months for annual
          const isPopular = plan.id === "professional";
          return (
            <div
              key={plan.id}
              className={`card relative transition-shadow hover:shadow-lg ${isPopular ? "ring-2" : ""}`}
              style={
                isPopular
                  ? { borderColor: "var(--color-primary)", boxShadow: "var(--shadow-card-hover)" }
                  : undefined
              }
            >
              {isPopular && (
                <span
                  className="absolute -top-2.5 left-6 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ background: "var(--color-accent-gold)", color: "var(--color-ink)" }}
                >
                  Most popular
                </span>
              )}
              <p className="text-h3 font-semibold mt-1" style={{ color: "var(--color-ink)" }}>
                {plan.name}
              </p>
              <p className="mt-2 text-[1.75rem] font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
                {formatCurrency(displayPrice, currency)}
                <span className="text-body font-normal" style={{ color: "var(--color-ink-tertiary)" }}>
                  /user/mo
                </span>
              </p>
              {annual && (
                <p className="mt-1 text-caption" style={{ color: "var(--color-ink-muted)" }}>
                  Billed annually
                </p>
              )}
              <ul className="mt-6 space-y-2 text-body" style={{ color: "var(--color-ink-secondary)" }}>
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-teal-500, #14b8a6)" }} aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.id === "enterprise" ? "mailto:sales@westbridge.gy" : ROUTES.signup}
                className="mt-8 flex w-full justify-center rounded-lg border border-transparent px-6 py-3 text-[0.9375rem] font-semibold transition-all duration-150"
                style={
                  isPopular
                    ? { background: "var(--color-primary)", color: "white" }
                    : { background: "var(--color-ground-section)", color: "var(--color-ink)" }
                }
              >
                {plan.id === "enterprise" ? "Talk to sales" : "Start free trial"}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
