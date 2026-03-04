"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/locale/currency";
import { formatDate } from "@/lib/locale/date";
import type { CurrencyCode } from "@/lib/constants";
import { FileText } from "lucide-react";

/* ---------- types ---------- */

interface InvoiceRow {
  id: string;
  customer: string;
  amount: number;
  currency: CurrencyCode;
  status: string;
  date: string;
  dueDate: string;
}

/* ---------- ERP mapper ---------- */

function mapErpInvoice(d: Record<string, unknown>): InvoiceRow {
  const name = (d.name as string) ?? "";
  const customer = (d.customer_name as string) ?? (d.customer as string) ?? "\u2014";
  const amount = Number(d.grand_total ?? d.outstanding_amount ?? 0);
  const currency = ((d.currency as string) ?? "USD") as CurrencyCode;
  const status = String(d.status ?? "Draft").trim();
  const date = (d.posting_date as string) ?? "";
  const dueDate = (d.due_date as string) ?? "";
  return { id: name, customer, amount, currency, status, date, dueDate };
}

/* ---------- filters ---------- */

const FILTERS = ["All", "Draft", "Unpaid", "Paid", "Overdue"] as const;

/* ---------- column definitions ---------- */

const columns: Column<InvoiceRow>[] = [
  {
    id: "id",
    header: "Invoice #",
    accessor: (row) => (
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>{row.id}</span>
    ),
    sortValue: (row) => row.id,
  },
  {
    id: "customer",
    header: "Customer",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>{row.customer}</span>
    ),
    sortValue: (row) => row.customer,
  },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    accessor: (row) => (
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
        {formatCurrency(row.amount, row.currency)}
      </span>
    ),
    sortValue: (row) => row.amount,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => <Badge status={row.status}>{row.status}</Badge>,
    sortValue: (row) => row.status,
  },
  {
    id: "date",
    header: "Date",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-tertiary)" }}>
        {row.date ? formatDate(row.date) : "\u2014"}
      </span>
    ),
    sortValue: (row) => row.date,
  },
  {
    id: "dueDate",
    header: "Due Date",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-tertiary)" }}>
        {row.dueDate ? formatDate(row.dueDate) : "\u2014"}
      </span>
    ),
    sortValue: (row) => row.dueDate,
  },
];

/* ---------- component ---------- */

export default function InvoicesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/erp/list?doctype=Sales%20Invoice");
      if (res.status === 401) {
        throw new Error("Session expired. Please sign in again.");
      }
      if (!res.ok) {
        throw new Error("Failed to load invoices.");
      }
      const json = await res.json();
      const raw = (json?.data ?? []) as Record<string, unknown>[];
      setInvoices(raw.map(mapErpInvoice));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchFilter = filter === "All" || inv.status === filter;
      const matchSearch =
        !search ||
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.customer.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [invoices, filter, search]);

  const handleCreateInvoice = useCallback(() => {
    router.push("/dashboard/invoices/new");
  }, [router]);

  /* --- error state --- */
  if (error) {
    return (
      <div>
        <PageHeader
          title="Invoices"
          action={
            <Button variant="primary" onClick={handleCreateInvoice}>
              Create Invoice
            </Button>
          }
        />
        <div
          className="mt-6 flex flex-col items-center justify-center rounded-[var(--radius-md)] border py-16 text-center"
          style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ background: "rgb(239 68 68 / 0.1)", color: "var(--color-error)" }}
          >
            <FileText className="h-6 w-6" />
          </div>
          <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>
            Something went wrong
          </p>
          <p className="mt-2 max-w-sm text-body" style={{ color: "var(--color-ink-secondary)" }}>
            {error}
          </p>
          <div className="mt-6">
            <Button variant="primary" onClick={loadInvoices}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  /* --- loading state --- */
  if (loading) {
    return (
      <div>
        <PageHeader
          title="Invoices"
          action={
            <Button variant="primary" disabled>
              Create Invoice
            </Button>
          }
        />
        <div className="mt-6">
          <SkeletonTable rows={8} columns={6} />
        </div>
      </div>
    );
  }

  /* --- empty state (no invoices at all) --- */
  if (invoices.length === 0) {
    return (
      <div>
        <PageHeader
          title="Invoices"
          action={
            <Button variant="primary" onClick={handleCreateInvoice}>
              Create Invoice
            </Button>
          }
        />
        <div
          className="mt-6 rounded-[var(--radius-md)] border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No invoices yet"
            description="Create your first invoice to start tracking payments and revenue."
            actionLabel="Create Invoice"
            onAction={handleCreateInvoice}
          />
        </div>
      </div>
    );
  }

  /* --- success state --- */
  return (
    <div>
      <PageHeader
        title="Invoices"
        action={
          <Button variant="primary" onClick={handleCreateInvoice}>
            Create Invoice
          </Button>
        }
      />

      {/* Filters & Search */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search invoices..."
          className="w-80 rounded-[var(--radius-sm)] px-4 py-2.5 text-[0.9375rem] outline-none transition-colors"
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-ground-elevated)",
            color: "var(--color-ink)",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  background: isActive ? "var(--color-ink)" : "var(--color-ground-muted)",
                  color: isActive ? "var(--color-ground)" : "var(--color-ink-secondary)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data table */}
      <div className="mt-4">
        <DataTable<InvoiceRow>
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          emptyTitle="No matching invoices"
          emptyDescription="Try adjusting your search or filter criteria."
          pageSize={20}
        />
      </div>
    </div>
  );
}
