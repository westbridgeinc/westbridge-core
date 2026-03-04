"use client";

import { useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Calculator } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { SkeletonCard, SkeletonChart } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/locale/currency";

/* ------------------------------------------------------------------ */
/*  Static data (replace with API call in production)                  */
/* ------------------------------------------------------------------ */

const barData = [
  { month: "Sep", revenue: 2.8, expenses: 1.8 },
  { month: "Oct", revenue: 3.1, expenses: 2.0 },
  { month: "Nov", revenue: 2.9, expenses: 1.9 },
  { month: "Dec", revenue: 3.4, expenses: 2.2 },
  { month: "Jan", revenue: 3.0, expenses: 2.0 },
  { month: "Feb", revenue: 3.2, expenses: 2.1 },
];

const aging = [
  { label: "Current", amount: 1.2, total: 2.8 },
  { label: "1-30 days", amount: 0.8, total: 2.8 },
  { label: "31-60 days", amount: 0.45, total: 2.8 },
  { label: "61-90 days", amount: 0.2, total: 2.8 },
  { label: "90+ days", amount: 0.15, total: 2.8 },
];

const metrics = [
  { label: "Revenue YTD", value: 18_400_000, variant: "default" as const },
  { label: "Expenses YTD", value: 12_100_000, variant: "default" as const },
  { label: "Net Profit", value: 6_300_000, variant: "success" as const },
];

/* ------------------------------------------------------------------ */
/*  Metric card                                                        */
/* ------------------------------------------------------------------ */

function MetricCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "success";
}) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-ground-elevated)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--color-ink-tertiary)" }}>
        {label}
      </p>
      <p
        className="mt-1 text-2xl font-semibold"
        style={{
          color: variant === "success" ? "var(--color-success)" : "var(--color-ink)",
        }}
      >
        {formatCurrency(value, "USD")}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom tooltip for Recharts                                        */
/* ------------------------------------------------------------------ */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{
        background: "var(--color-ground-elevated)",
        borderColor: "var(--color-border)",
      }}
    >
      <p className="mb-1 font-medium" style={{ color: "var(--color-ink)" }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span style={{ color: "var(--color-ink-secondary)" }}>
            {entry.name}: {formatCurrency(entry.value * 1_000_000, "USD")}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  States                                                             */
/* ------------------------------------------------------------------ */

type PageState = "loading" | "error" | "success";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AccountingPage() {
  const [state, setState] = useState<PageState>("success");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const retry = useCallback(() => {
    setErrorMessage(null);
    setState("loading");
    // Simulate reload
    setTimeout(() => setState("success"), 800);
  }, []);

  /* ---------- Loading state ---------- */
  if (state === "loading") {
    return (
      <div>
        <PageHeader
          title="Accounting"
          description="General ledger and financial overview"
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="mt-8">
          <SkeletonChart height={256} />
        </div>
        <div className="mt-8">
          <SkeletonChart height={180} />
        </div>
      </div>
    );
  }

  /* ---------- Error state ---------- */
  if (state === "error") {
    return (
      <div>
        <PageHeader
          title="Accounting"
          description="General ledger and financial overview"
        />
        <div
          className="mt-6 rounded-xl border p-6 text-center"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-ground-elevated)",
          }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ background: "rgb(239 68 68 / 0.1)", color: "var(--color-error)" }}
          >
            <Calculator className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
            Something went wrong
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-ink-tertiary)" }}>
            {errorMessage ?? "Failed to load accounting data."}
          </p>
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={retry}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Success state ---------- */
  return (
    <div>
      <PageHeader
        title="Accounting"
        description="General ledger and financial overview"
      />

      {/* Metric cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            variant={m.variant}
          />
        ))}
      </div>

      {/* Revenue vs Expenses chart */}
      <div
        className="mt-8 rounded-xl border p-6"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-ground-elevated)",
        }}
      >
        <p className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>
          Revenue vs Expenses
        </p>
        <p className="text-sm" style={{ color: "var(--color-ink-tertiary)" }}>
          Monthly (Sep &ndash; Feb)
        </p>
        <div className="mt-4 h-64 min-h-[256px] w-full">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart
              data={barData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-ink-tertiary)" }}
              />
              <YAxis
                hide
                domain={[0, 4]}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "var(--color-ground-muted)" }}
              />
              <Legend
                wrapperStyle={{ color: "var(--color-ink-secondary)", fontSize: 12 }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="var(--color-accent)"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="var(--color-border)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accounts Receivable Aging */}
      <div
        className="mt-8 rounded-xl border p-6"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-ground-elevated)",
        }}
      >
        <p className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>
          Accounts Receivable Aging
        </p>
        <div className="mt-4 space-y-3">
          {aging.map((row) => (
            <div key={row.label} className="flex items-center gap-4">
              <span
                className="w-24 text-sm"
                style={{ color: "var(--color-ink-secondary)" }}
              >
                {row.label}
              </span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full"
                style={{ background: "var(--color-ground-muted)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(row.amount / row.total) * 100}%`,
                    background: "var(--color-accent)",
                  }}
                />
              </div>
              <span
                className="w-24 text-right text-sm font-medium"
                style={{ color: "var(--color-ink)" }}
              >
                {formatCurrency(row.amount * 1_000_000, "USD")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
