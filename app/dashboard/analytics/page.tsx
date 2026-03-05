"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { MODULE_EMPTY_STATES, EMPTY_STATE_SUPPORT_LINE } from "@/lib/dashboard/empty-state-config";

const revData = [
  { month: "Mar", value: 2.1 }, { month: "Apr", value: 2.4 }, { month: "May", value: 2.6 },
  { month: "Jun", value: 2.8 }, { month: "Jul", value: 2.9 }, { month: "Aug", value: 3.0 },
  { month: "Sep", value: 2.8 }, { month: "Oct", value: 3.1 }, { month: "Nov", value: 2.9 },
  { month: "Dec", value: 3.4 }, { month: "Jan", value: 3.0 }, { month: "Feb", value: 3.2 },
];

const topCustomers = [
  { name: "Republic Bank GY", revenue: "4.2M" },
  { name: "Demerara Shipping Co", revenue: "2.8M" },
  { name: "New Amsterdam Builders", revenue: "2.1M" },
  { name: "Georgetown Hardware Ltd", revenue: "1.9M" },
  { name: "Linden Mining Corp", revenue: "1.5M" },
];

const byCategory = [
  { name: "Construction", value: 8.2 }, { name: "Retail", value: 4.1 },
  { name: "Services", value: 3.5 }, { name: "Manufacturing", value: 2.8 }, { name: "Other", value: 1.4 },
];

export default function AnalyticsPage() {
  const [hasData, setHasData] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/erp/dashboard")
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          setHasData(false);
          return;
        }
        return res.json();
      })
      .then((json) => {
        if (cancelled || json === undefined) return;
        const d = json?.data;
        const revenue = Number(d?.revenueMTD ?? 0);
        const activity = Array.isArray(d?.activity) ? d.activity : [];
        setHasData(revenue > 0 || activity.length > 0);
      })
      .catch(() => {
        if (!cancelled) setHasData(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (hasData === false) {
    return (
      <div>
        <PageHeader title="Analytics" description="Reports and business intelligence" />
        <div
          className="mt-6 rounded-[var(--radius-md)] border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title={MODULE_EMPTY_STATES.analytics.title}
            description={MODULE_EMPTY_STATES.analytics.description}
            actionLabel={MODULE_EMPTY_STATES.analytics.actionLabel}
            actionHref={MODULE_EMPTY_STATES.analytics.actionLink}
            supportLine={EMPTY_STATE_SUPPORT_LINE}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Analytics" description="Reports and business intelligence" />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Revenue" value="USD 3.2M" subtext="↑ 8% vs last quarter" subtextVariant="success" />
        <MetricCard label="Expenses" value="USD 2.1M" subtext="↑ 3% vs last quarter" subtextVariant="error" />
        <MetricCard label="Profit Margin" value="34.4%" subtext="↑ 2.1pp" subtextVariant="success" />
        <MetricCard label="Outstanding" value="USD 1.8M" subtext="12 invoices overdue" subtextVariant="error" />
      </div>

      <div
        className="mt-8 rounded-[var(--radius-md)] border p-6"
        style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
      >
        <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>Revenue Trend</p>
        <p className="mt-0.5" style={{ fontSize: "var(--font-caption)", color: "var(--color-ink-tertiary)" }}>Last 12 months</p>
        <div className="mt-4 h-64 min-h-[256px] w-full">
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={revData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-ink-tertiary)" }} />
              <YAxis hide domain={[0, 4]} />
              <Tooltip
                formatter={(value) => [value != null ? `${Number(value)}M` : "—", "Revenue"]}
                contentStyle={{ background: "var(--color-ground-elevated)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-ink)" }}
                labelStyle={{ color: "var(--color-ink-secondary)" }}
              />
              <Area type="monotone" dataKey="value" stroke="var(--color-accent)" strokeWidth={2} fill="url(#fillRevAnalytics)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className="rounded-[var(--radius-md)] border p-6"
          style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
        >
          <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>Top Customers by Revenue</p>
          <ul className="mt-4 space-y-3">
            {topCustomers.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between text-[0.9375rem]">
                <span style={{ color: "var(--color-ink-tertiary)" }}>{i + 1}.</span>
                <span className="flex-1 pl-2" style={{ color: "var(--color-ink)" }}>{c.name}</span>
                <span className="font-medium" style={{ color: "var(--color-ink)" }}>USD {c.revenue}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-[var(--radius-md)] border p-6"
          style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
        >
          <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>Revenue by Category</p>
          <div className="mt-4 h-48 min-h-[192px] w-full">
            <ResponsiveContainer width="100%" height={192}>
              <BarChart data={byCategory} layout="vertical" margin={{ top: 0, right: 0, left: 80, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-ink-tertiary)" }} />
                <Tooltip
                  formatter={(value) => [`${Number(value)}M`, "Revenue"]}
                  contentStyle={{ background: "var(--color-ground-elevated)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-ink)" }}
                />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

