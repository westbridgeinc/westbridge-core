"use client";

import { useState, useEffect, useMemo } from "react";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/locale/currency";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface InventoryItem {
  id: string;
  item: string;
  warehouse: string;
  qty: number;
  value: number;
  uom: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface InventoryStats {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

/* ------------------------------------------------------------------ */
/*  Badge variant mapping for inventory-specific statuses              */
/* ------------------------------------------------------------------ */

function inventoryBadgeVariant(status: string): "success" | "warning" | "error" {
  if (status === "Out of Stock") return "error";
  if (status === "Low Stock") return "warning";
  return "success";
}

/* ------------------------------------------------------------------ */
/*  Demo data (swap for API call in production)                        */
/* ------------------------------------------------------------------ */

const DEMO_ITEMS: InventoryItem[] = [
  { id: "ITM-001", item: "Portland Cement", warehouse: "Georgetown Main", qty: 450, value: 2250000, uom: "Bags", status: "In Stock" },
  { id: "ITM-002", item: "Demerara Gold Rum", warehouse: "Demerara Warehouse", qty: 12, value: 480000, uom: "Cases", status: "Low Stock" },
  { id: "ITM-003", item: "Galvanize Sheets", warehouse: "Georgetown Main", qty: 0, value: 0, uom: "Sheets", status: "Out of Stock" },
  { id: "ITM-004", item: "Basmati Rice", warehouse: "Berbice Store", qty: 320, value: 1280000, uom: "Bags", status: "In Stock" },
  { id: "ITM-005", item: "Car Battery", warehouse: "Georgetown Main", qty: 8, value: 320000, uom: "Units", status: "Low Stock" },
  { id: "ITM-006", item: "Printer Paper", warehouse: "Head Office", qty: 85, value: 85000, uom: "Reams", status: "In Stock" },
  { id: "ITM-007", item: "Safety Helmets", warehouse: "Georgetown Main", qty: 0, value: 0, uom: "Units", status: "Out of Stock" },
  { id: "ITM-008", item: "Diesel Fuel", warehouse: "Fuel Depot", qty: 1200, value: 3600000, uom: "Litres", status: "In Stock" },
];

function deriveStats(items: InventoryItem[]): InventoryStats {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + 1,
      lowStock: acc.lowStock + (item.status === "Low Stock" ? 1 : 0),
      outOfStock: acc.outOfStock + (item.status === "Out of Stock" ? 1 : 0),
      totalValue: acc.totalValue + item.value,
    }),
    { totalItems: 0, lowStock: 0, outOfStock: 0, totalValue: 0 },
  );
}

/* ------------------------------------------------------------------ */
/*  Columns                                                            */
/* ------------------------------------------------------------------ */

const columns: Column<InventoryItem>[] = [
  {
    id: "item",
    header: "Item",
    accessor: (row) => (
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
        {row.item}
      </span>
    ),
    sortValue: (row) => row.item,
  },
  {
    id: "warehouse",
    header: "Warehouse",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>{row.warehouse}</span>
    ),
    sortValue: (row) => row.warehouse,
  },
  {
    id: "qty",
    header: "Qty",
    align: "right",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>
        {row.qty.toLocaleString()}
      </span>
    ),
    sortValue: (row) => row.qty,
  },
  {
    id: "value",
    header: "Value",
    align: "right",
    accessor: (row) => (
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
        {formatCurrency(row.value)}
      </span>
    ),
    sortValue: (row) => row.value,
  },
  {
    id: "uom",
    header: "UOM",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-tertiary)" }}>{row.uom}</span>
    ),
    sortValue: (row) => row.uom,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => (
      <Badge variant={inventoryBadgeVariant(row.status)}>{row.status}</Badge>
    ),
    sortValue: (row) =>
      row.status === "Out of Stock" ? 0 : row.status === "Low Stock" ? 1 : 2,
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = () => {
    setLoading(true);
    setError(null);

    // Simulate async fetch -- replace with real API call
    const timer = setTimeout(() => {
      try {
        setItems(DEMO_ITEMS);
      } catch {
        setError("Failed to load inventory data.");
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const cleanup = fetchInventory();
    return cleanup;
  }, []);

  const stats = useMemo(() => deriveStats(items), [items]);

  /* ---- Error state ---- */
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Inventory" description="Stock levels and warehouse management" />
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
          <Button variant="secondary" size="sm" onClick={fetchInventory}>
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
        <PageHeader title="Inventory" description="Stock levels and warehouse management" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card animate-pulse"
              style={{ minHeight: 88 }}
            />
          ))}
        </div>
        <SkeletonTable rows={8} columns={6} />
      </div>
    );
  }

  /* ---- Success / Empty states ---- */
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Stock levels and warehouse management" />

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricCard label="Total Items" value={stats.totalItems} />
        <MetricCard
          label="Low Stock"
          value={stats.lowStock}
          subtextVariant={stats.lowStock > 0 ? "error" : "muted"}
        />
        <MetricCard
          label="Out of Stock"
          value={stats.outOfStock}
          subtextVariant={stats.outOfStock > 0 ? "error" : "muted"}
        />
        <MetricCard label="Total Value" value={formatCurrency(stats.totalValue)} />
      </div>

      {/* Data table */}
      <DataTable<InventoryItem>
        columns={columns}
        data={items}
        keyExtractor={(r) => r.id}
        loading={false}
        emptyState={
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No inventory items"
            description="Your inventory is empty. Add items to start tracking stock levels and values."
            actionLabel="Add Item"
            onAction={() => {}}
          />
        }
        pageSize={20}
      />
    </div>
  );
}
