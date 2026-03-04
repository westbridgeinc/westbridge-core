"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { formatCurrency } from "@/lib/locale/currency";
import { formatDateLong } from "@/lib/locale/date";

interface QuotationRow {
  id: string;
  customer: string;
  amount: number;
  validUntil: string;
  status: string;
}

function fmtDate(d: string): string {
  if (!d) return "—";
  try { return formatDateLong(d); } catch { return d; }
}

const columns: Column<QuotationRow>[] = [
  { id: "id", header: "Quote #", accessor: (r) => <span className="font-medium" style={{ color: "var(--color-ink)" }}>{r.id}</span>, sortValue: (r) => r.id },
  { id: "customer", header: "Customer", accessor: (r) => <span style={{ color: "var(--color-ink-secondary)" }}>{r.customer}</span>, sortValue: (r) => r.customer },
  { id: "amount", header: "Amount", align: "right", accessor: (r) => <span className="font-medium" style={{ color: "var(--color-ink)" }}>{formatCurrency(r.amount, "GYD")}</span>, sortValue: (r) => r.amount },
  { id: "validUntil", header: "Valid Until", accessor: (r) => <span style={{ color: "var(--color-ink-tertiary)" }}>{fmtDate(r.validUntil)}</span>, sortValue: (r) => r.validUntil },
  { id: "status", header: "Status", accessor: (r) => <Badge status={r.status}>{r.status}</Badge> },
];

export default function QuotationsPage() {
  const [data, setData] = useState<QuotationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    fetch("/api/erp/list?doctype=Quotation")
      .then((res) => { if (!res.ok) throw new Error(res.status === 401 ? "Session expired. Please sign in again." : "Failed to load quotations."); return res.json(); })
      .then((json) => { const raw = (json?.data ?? []) as QuotationRow[]; setData(raw); setError(null); })
      .catch((err: Error) => { setError(err.message); setData([]); })
      .finally(() => setLoading(false));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchData();
  }, [fetchData]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const action = <Button variant="primary" size="md">New Quote</Button>;

  if (error) {
    return (
      <div>
        <PageHeader title="Quotations" description="Sales quotations and proposals" action={action} />
        <div className="mt-8 flex flex-col items-center rounded-[var(--radius-md)] border p-12" style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}>
          <p style={{ color: "var(--color-error)" }}>{error}</p>
          <Button variant="secondary" size="sm" onClick={load} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Quotations" description="Sales quotations and proposals" action={action} />
      <div className="mt-8">
        {loading ? <SkeletonTable rows={6} columns={5} /> : (
          <DataTable
            columns={columns}
            data={data}
            keyExtractor={(r) => r.id}
            emptyTitle="No quotations"
            emptyDescription="Create your first quotation to get started."
            emptyActionLabel="New Quote"
            pageSize={20}
          />
        )}
      </div>
    </div>
  );
}
