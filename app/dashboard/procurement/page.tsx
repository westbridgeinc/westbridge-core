"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { formatCurrency } from "@/lib/locale/currency";
import { formatDateLong } from "@/lib/locale/date";

interface PurchaseOrder {
  id: string;
  supplier: string;
  amount: number;
  orderDate: string;
  expected: string;
  status: string;
}

function fmtDate(d: string): string {
  if (!d) return "—";
  try { return formatDateLong(d); } catch { return d; }
}

const columns: Column<PurchaseOrder>[] = [
  { id: "id", header: "PO #", accessor: (r) => <span className="font-medium" style={{ color: "var(--color-ink)" }}>{r.id}</span>, sortValue: (r) => r.id },
  { id: "supplier", header: "Supplier", accessor: (r) => <span style={{ color: "var(--color-ink-secondary)" }}>{r.supplier}</span>, sortValue: (r) => r.supplier },
  { id: "amount", header: "Amount", align: "right", accessor: (r) => <span className="font-medium" style={{ color: "var(--color-ink)" }}>{formatCurrency(r.amount, "GYD")}</span>, sortValue: (r) => r.amount },
  { id: "orderDate", header: "Order Date", accessor: (r) => <span style={{ color: "var(--color-ink-tertiary)" }}>{fmtDate(r.orderDate)}</span>, sortValue: (r) => r.orderDate },
  { id: "expected", header: "Expected", accessor: (r) => <span style={{ color: "var(--color-ink-tertiary)" }}>{fmtDate(r.expected)}</span>, sortValue: (r) => r.expected },
  { id: "status", header: "Status", accessor: (r) => <Badge status={r.status}>{r.status}</Badge> },
];

export default function ProcurementPage() {
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    fetch("/api/erp/list?doctype=Purchase%20Order")
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 401 ? "Session expired. Please sign in again." : "Failed to load purchase orders.");
        return res.json();
      })
      .then((json) => {
        const raw = (json?.data ?? []) as PurchaseOrder[];
        setData(raw);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchData();
  }, [fetchData]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const action = <Button variant="primary" size="md">Create PO</Button>;

  if (error) {
    return (
      <div>
        <PageHeader title="Procurement" description="Purchase orders and suppliers" action={action} />
        <div className="mt-8 flex flex-col items-center rounded-[var(--radius-md)] border p-12" style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}>
          <p style={{ color: "var(--color-error)" }}>{error}</p>
          <Button variant="secondary" size="sm" onClick={load} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Procurement" description="Purchase orders and suppliers" action={action} />
      <div className="mt-8">
        {loading ? (
          <SkeletonTable rows={6} columns={6} />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            keyExtractor={(r) => r.id}
            emptyTitle="No purchase orders"
            emptyDescription="Create your first purchase order to get started."
            emptyActionLabel="Create PO"
            pageSize={20}
          />
        )}
      </div>
    </div>
  );
}
