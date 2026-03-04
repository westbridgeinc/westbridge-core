"use client";

import { useState, useEffect, useMemo } from "react";
import { Banknote } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/locale/currency";
import { formatDate } from "@/lib/locale/date";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PayrollRecord {
  id: string;
  employee: string;
  period: string;        // ISO date or display string
  grossPay: number;
  deductions: number;
  netPay: number;
  status: "Processed" | "Pending" | "Rejected";
}

interface PayrollStats {
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  headcount: number;
}

/* ------------------------------------------------------------------ */
/*  Demo data (swap for API call in production)                        */
/* ------------------------------------------------------------------ */

const DEMO_RECORDS: PayrollRecord[] = [
  { id: "PAY-001", employee: "Priya Ramdeen", period: "2025-02-28", grossPay: 285000, deductions: 82700, netPay: 202300, status: "Processed" },
  { id: "PAY-002", employee: "Devendra Singh", period: "2025-02-28", grossPay: 320000, deductions: 92800, netPay: 227200, status: "Processed" },
  { id: "PAY-003", employee: "Shantelle Williams", period: "2025-02-28", grossPay: 310000, deductions: 89900, netPay: 220100, status: "Processed" },
  { id: "PAY-004", employee: "Rajiv Persaud", period: "2025-02-28", grossPay: 295000, deductions: 85600, netPay: 209400, status: "Processed" },
  { id: "PAY-005", employee: "Camille Thomas", period: "2025-02-28", grossPay: 268000, deductions: 77700, netPay: 190300, status: "Pending" },
  { id: "PAY-006", employee: "Akash Doobay", period: "2025-02-28", grossPay: 275000, deductions: 79800, netPay: 195200, status: "Processed" },
];

function deriveStats(records: PayrollRecord[]): PayrollStats {
  return records.reduce(
    (acc, r) => ({
      totalGross: acc.totalGross + r.grossPay,
      totalDeductions: acc.totalDeductions + r.deductions,
      totalNet: acc.totalNet + r.netPay,
      headcount: acc.headcount + 1,
    }),
    { totalGross: 0, totalDeductions: 0, totalNet: 0, headcount: 0 },
  );
}

/* ------------------------------------------------------------------ */
/*  Columns                                                            */
/* ------------------------------------------------------------------ */

const columns: Column<PayrollRecord>[] = [
  {
    id: "employee",
    header: "Employee",
    accessor: (row) => (
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
        {row.employee}
      </span>
    ),
    sortValue: (row) => row.employee,
  },
  {
    id: "period",
    header: "Period",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>{formatDate(row.period)}</span>
    ),
    sortValue: (row) => row.period,
  },
  {
    id: "grossPay",
    header: "Gross Pay",
    align: "right",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>{formatCurrency(row.grossPay)}</span>
    ),
    sortValue: (row) => row.grossPay,
  },
  {
    id: "deductions",
    header: "Deductions",
    align: "right",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-tertiary)" }}>{formatCurrency(row.deductions)}</span>
    ),
    sortValue: (row) => row.deductions,
  },
  {
    id: "netPay",
    header: "Net Pay",
    align: "right",
    accessor: (row) => (
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
        {formatCurrency(row.netPay)}
      </span>
    ),
    sortValue: (row) => row.netPay,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => <Badge status={row.status}>{row.status}</Badge>,
    sortValue: (row) => row.status,
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function PayrollPage() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayroll = () => {
    setLoading(true);
    setError(null);

    // Simulate async fetch -- replace with real API call
    const timer = setTimeout(() => {
      try {
        setRecords(DEMO_RECORDS);
      } catch {
        setError("Failed to load payroll records.");
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const cleanup = fetchPayroll();
    return cleanup;
  }, []);

  const stats = useMemo(() => deriveStats(records), [records]);

  /* ---- Error state ---- */
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payroll" description="Payroll runs, salary slips and deductions" />
        <div
          className="flex flex-col items-center gap-4 rounded-[var(--radius-md)] border px-6 py-16 text-center"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-ground-elevated)",
          }}
        >
          <p className="text-body" style={{ color: "var(--color-ink-secondary)" }}>
            {error}
          </p>
          <Button variant="secondary" size="sm" onClick={fetchPayroll}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payroll" description="Payroll runs, salary slips and deductions" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card animate-pulse"
              style={{ minHeight: 88 }}
            />
          ))}
        </div>
        <SkeletonTable rows={6} columns={6} />
      </div>
    );
  }

  /* ---- Success / Empty states ---- */
  return (
    <div className="space-y-6">
      <PageHeader title="Payroll" description="Payroll runs, salary slips and deductions" />

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricCard label="Employees" value={stats.headcount} />
        <MetricCard label="Total Gross" value={formatCurrency(stats.totalGross)} />
        <MetricCard label="Total Deductions" value={formatCurrency(stats.totalDeductions)} />
        <MetricCard label="Total Net Pay" value={formatCurrency(stats.totalNet)} />
      </div>

      {/* Data table */}
      <DataTable<PayrollRecord>
        columns={columns}
        data={records}
        keyExtractor={(r) => r.id}
        loading={false}
        emptyState={
          <EmptyState
            icon={<Banknote className="h-6 w-6" />}
            title="No payroll records"
            description="There are no payroll runs for the current period. Process a payroll run to see records here."
            actionLabel="Run Payroll"
            onAction={() => {}}
          />
        }
        pageSize={20}
      />
    </div>
  );
}
