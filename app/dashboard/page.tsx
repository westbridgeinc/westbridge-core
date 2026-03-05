"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { WelcomeModal } from "@/components/dashboard/WelcomeModal";
import { Button } from "@/components/ui/Button";
import { SkeletonCard, SkeletonChart } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/locale/currency";

const WELCOMED_KEY = "wb_welcomed";

/* ---------- types ---------- */

interface RevenuePoint {
  month: string;
  value: number;
}

interface ActivityItem {
  text: string;
  time: string;
  type: "success" | "error" | "info" | "default";
}

interface DashboardData {
  revenueMTD: number;
  revenueChange: number;
  outstandingCount: number;
  openDealsCount: number;
  employeeCount: number;
  employeeDelta: number;
  revenueData: RevenuePoint[];
  activity: ActivityItem[];
}

/* ---------- data fetcher ---------- */

async function fetchDashboardData(): Promise<DashboardData> {
  const res = await fetch("/api/erp/dashboard");

  if (!res.ok) {
    throw new Error(res.status === 401 ? "Session expired. Please sign in again." : "Failed to load dashboard data.");
  }

  const json = await res.json();
  return json.data as DashboardData;
}

/* ---------- quick action links ---------- */

const QUICK_ACTIONS = [
  { label: "New Invoice", href: "/dashboard/invoices" },
  { label: "New Quote", href: "/dashboard/quotations" },
  { label: "Add Employee", href: "/dashboard/hr" },
  { label: "Add Deal", href: "/dashboard/crm" },
] as const;

/* ---------- dot color helper ---------- */

function activityDotColor(type: ActivityItem["type"]): string {
  switch (type) {
    case "success":
      return "var(--color-success)";
    case "error":
      return "var(--color-error)";
    case "info":
      return "var(--color-accent)";
    default:
      return "var(--color-ink-tertiary)";
  }
}

/* ---------- trend arrow helper ---------- */

function trendArrow(value: number): string {
  if (value > 0) return `\u2191 +${value}%`;
  if (value < 0) return `\u2193 ${value}%`;
  return "No change";
}

/* ---------- component ---------- */

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const checklistRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setShowWelcome(typeof window !== "undefined" ? localStorage.getItem(WELCOMED_KEY) !== "true" : false);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardData();
      setData(result);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* --- error state --- */
  if (error && !data) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Welcome back." />
        <div
          data-testid="dashboard-error"
          className="mt-8 flex flex-col items-center justify-center rounded-[var(--radius-md)] border py-16 text-center"
          style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
        >
          <p className="text-body" style={{ color: "var(--color-error)" }}>{error}</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={loadData}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  /* --- loading state --- */
  if (loading || !data) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Welcome back." />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="mt-8">
          <SkeletonChart height={256} />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div
            className="rounded-[var(--radius-md)] border p-6 lg:col-span-2"
            style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
          >
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full animate-pulse"
                    style={{ background: "var(--color-ground-muted)" }}
                  />
                  <span
                    className="h-4 flex-1 animate-pulse rounded-[var(--radius-sm)]"
                    style={{ background: "var(--color-ground-muted)" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className="rounded-[var(--radius-md)] border p-6"
            style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
          >
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-12 w-full animate-pulse rounded-[var(--radius-sm)]"
                  style={{ background: "var(--color-ground-muted)" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* --- success state --- */
  const revenueChangeVariant = data.revenueChange >= 0 ? "success" : "error";
  const employeeDeltaVariant = data.employeeDelta >= 0 ? "success" : "error";

  return (
    <div>
      <WelcomeModal
        open={showWelcome === true}
        onClose={() => setShowWelcome(false)}
        onGetStarted={() => {
          setShowWelcome(false);
          requestAnimationFrame(() => checklistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
        }}
      />
      <PageHeader title="Dashboard" description="Welcome back." />
      <OnboardingChecklist checklistRef={checklistRef} />

      {/* Metric cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Revenue (MTD)"
          value={formatCurrency(data.revenueMTD, "USD")}
          subtext={trendArrow(data.revenueChange) + " from last month"}
          subtextVariant={revenueChangeVariant}
        />
        <MetricCard
          label="Outstanding Invoices"
          value={`${data.outstandingCount} open`}
          subtext={data.outstandingCount > 0 ? "\u2193 Requires follow-up" : "All clear"}
          subtextVariant={data.outstandingCount > 0 ? "error" : "success"}
        />
        <MetricCard
          label="Open Deals"
          value={`${data.openDealsCount} active`}
          subtext="In pipeline"
        />
        <MetricCard
          label="Active Employees"
          value={`${data.employeeCount}+`}
          subtext={data.employeeDelta !== 0 ? `${trendArrow(data.employeeDelta).replaceAll("%", "")} this month` : "No change"}
          subtextVariant={employeeDeltaVariant}
        />
      </div>

      {/* Revenue chart */}
      <div
        className="mt-8 rounded-[var(--radius-md)] border p-6"
        style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
      >
        <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>Revenue</p>
        <p className="text-caption mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>Last 6 months</p>
        <div className="mt-4 h-64 min-h-[256px] w-full">
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={data.revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
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
                formatter={(value) => [value != null ? `${Number(value)}M` : "\u2014", "Revenue"]}
                contentStyle={{
                  background: "var(--color-ink)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-ground)",
                }}
                itemStyle={{ color: "var(--color-ground)" }}
                labelStyle={{ color: "var(--color-ground)", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-accent)"
                strokeWidth={2}
                fill="url(#fillRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity feed + Quick actions */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <div
          className="rounded-[var(--radius-md)] border p-6 lg:col-span-2"
          style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
        >
          <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>Recent Activity</p>
          {data.activity.length === 0 ? (
            <p className="mt-4 text-body" style={{ color: "var(--color-ink-tertiary)" }}>
              No recent activity to display.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {data.activity.map((a, i) => (
                <li key={i} className="flex items-start justify-between gap-4 text-body">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: activityDotColor(a.type) }}
                    />
                    <span style={{ color: "var(--color-ink)" }}>{a.text}</span>
                  </div>
                  <span className="shrink-0 text-caption" style={{ color: "var(--color-ink-tertiary)" }}>
                    {a.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div
          className="rounded-[var(--radius-md)] border p-6"
          style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
        >
          <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>Quick Actions</p>
          <div className="mt-4 flex flex-col gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href} prefetch={true}>
                <Button variant="secondary" size="md" className="w-full justify-start">
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
