"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/locale/currency";
import { formatDate } from "@/lib/locale/date";
import { MODULE_EMPTY_STATES, EMPTY_STATE_SUPPORT_LINE } from "@/lib/dashboard/empty-state-config";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ExpenseRow = {
  name: string;
  postingDate: string;
  description: string;
  category: string;
  amount: number;
  submittedBy: string;
  status: string;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function mapErpExpense(d: Record<string, unknown>): ExpenseRow {
  const amount = Number(
    d.total_sanctioned_amount ?? d.total_claimed_amount ?? d.grand_total ?? 0
  );
  return {
    name: String(d.name ?? ""),
    postingDate: String(d.posting_date ?? d.creation ?? ""),
    description: String(d.remark ?? d.employee_remarks ?? "Expense claim"),
    category: String(d.expense_type ?? "\u2014"),
    amount,
    submittedBy: String(d.employee_name ?? d.owner ?? "\u2014"),
    status: String(d.status ?? "Draft").trim(),
  };
}

/* ------------------------------------------------------------------ */
/*  Table columns                                                      */
/* ------------------------------------------------------------------ */

const expenseColumns: Column<ExpenseRow>[] = [
  {
    id: "date",
    header: "Date",
    accessor: (row) => (row.postingDate ? formatDate(row.postingDate) : "\u2014"),
    sortValue: (row) => row.postingDate || "",
    width: "120px",
  },
  {
    id: "description",
    header: "Description",
    accessor: (row) => row.description,
    sortValue: (row) => row.description,
  },
  {
    id: "category",
    header: "Category",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>{row.category}</span>
    ),
    sortValue: (row) => row.category,
    width: "140px",
  },
  {
    id: "amount",
    header: "Amount",
    accessor: (row) => (
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
        {row.amount > 0 ? formatCurrency(row.amount, "USD") : "\u2014"}
      </span>
    ),
    sortValue: (row) => row.amount,
    align: "right",
    width: "140px",
  },
  {
    id: "submittedBy",
    header: "Submitted By",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>{row.submittedBy}</span>
    ),
    sortValue: (row) => row.submittedBy,
    width: "160px",
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => <Badge status={row.status}>{row.status}</Badge>,
    sortValue: (row) => row.status,
    width: "120px",
  },
];

/* ------------------------------------------------------------------ */
/*  Metric card                                                        */
/* ------------------------------------------------------------------ */

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="rounded-xl border px-6 py-4"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-ground-elevated)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--color-ink-tertiary)" }}>
        {label}
      </p>
      <p
        className="mt-1 text-xl font-semibold"
        style={{ color: "var(--color-ink)" }}
      >
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ExpensesPage() {
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    setFetchKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/erp/list?doctype=Expense%20Claim")
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Session expired. Please sign in again.");
        }
        if (!res.ok) throw new Error("Failed to load expense claims.");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const raw = (json?.data ?? []) as Record<string, unknown>[];
        setRows(raw.map(mapErpExpense));
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  const totalAmount = useMemo(
    () => rows.reduce((sum, r) => sum + r.amount, 0),
    [rows]
  );
  const pendingCount = useMemo(
    () => rows.filter((r) => r.status === "Pending").length,
    [rows]
  );

  /* ---------- Error state ---------- */
  if (error) {
    return (
      <div>
        <PageHeader title="Expenses" description="Expense claims and approvals" />
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
            <Receipt className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
            Something went wrong
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-ink-tertiary)" }}>
            {error}
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

  /* ---------- Main render ---------- */
  return (
    <div>
      <PageHeader title="Expenses" description="Expense claims and approvals" />

      {/* Metric cards */}
      {loading ? (
        <div className="mt-6 flex gap-6">
          <SkeletonCard className="flex-1" />
          <SkeletonCard className="flex-1" />
          <SkeletonCard className="flex-1" />
        </div>
      ) : (
        <div className="mt-6 flex gap-6">
          <MetricCard
            label="Total claims"
            value={formatCurrency(totalAmount, "USD")}
          />
          <MetricCard label="Pending" value={pendingCount} />
          <MetricCard label="Total" value={rows.length} />
        </div>
      )}

      {/* Data table */}
      <div className="mt-6">
        <DataTable<ExpenseRow>
          columns={expenseColumns}
          data={rows}
          keyExtractor={(row) => row.name}
          loading={loading}
          emptyTitle={MODULE_EMPTY_STATES.expenses.title}
          emptyDescription={MODULE_EMPTY_STATES.expenses.description}
          emptyState={
            <div
              className="rounded-xl border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-ground-elevated)",
              }}
            >
              <EmptyState
                icon={<Receipt className="h-6 w-6" />}
                title={MODULE_EMPTY_STATES.expenses.title}
                description={MODULE_EMPTY_STATES.expenses.description}
                actionLabel={MODULE_EMPTY_STATES.expenses.actionLabel}
                actionHref={MODULE_EMPTY_STATES.expenses.actionLink}
                supportLine={EMPTY_STATE_SUPPORT_LINE}
              />
            </div>
          }
          pageSize={20}
        />
      </div>
    </div>
  );
}
