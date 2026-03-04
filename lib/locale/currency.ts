/**
 * Caribbean currency formatting and conversion.
 * GYD default; support GYD, USD, TTD, BBD, XCD, JMD.
 */

import type { CurrencyCode } from "@/lib/constants";

const CURRENCY_DISPLAY: Record<CurrencyCode, { symbol: string; decimals: number }> = {
  GYD: { symbol: "GY$", decimals: 2 },
  USD: { symbol: "$", decimals: 2 },
  TTD: { symbol: "TT$", decimals: 2 },
  BBD: { symbol: "Bds$", decimals: 2 },
  XCD: { symbol: "EC$", decimals: 2 },
  JMD: { symbol: "J$", decimals: 2 },
};

/** Format amount for display (e.g. "GY$ 1,250,000.00") */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "GYD"
): string {
  const { symbol, decimals } = CURRENCY_DISPLAY[currency];
  return `${symbol} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** Parse display string back to number (strip symbol and commas). */
export function parseCurrency(value: string, currency: CurrencyCode = "GYD"): number {
  const { symbol } = CURRENCY_DISPLAY[currency];
  const cleaned = value
    .replace(symbol, "")
    .replace(/,/g, "")
    .trim();
  return Number.parseFloat(cleaned) || 0;
}

export { CURRENCY_DISPLAY };
