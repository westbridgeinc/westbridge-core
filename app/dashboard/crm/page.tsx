"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Users, Briefcase } from "lucide-react";
import { MODULE_EMPTY_STATES, EMPTY_STATE_SUPPORT_LINE } from "@/lib/dashboard/empty-state-config";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/locale/currency";
import { formatDate } from "@/lib/locale/date";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Deal = {
  name: string;
  company: string;
  amount: number;
  contact: string;
  date: string;
  status: string;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapErpOpportunity(d: Record<string, unknown>): Deal {
  const name = String(d.name ?? "");
  const company = String(d.party_name ?? d.opportunity_from ?? "\u2014");
  const amount = Number(d.opportunity_amount ?? 0);
  const contact = String(d.contact_person ?? d.contact_display ?? "\u2014");
  const created = d.creation ?? d.modified;
  const date = created ? String(created) : "";
  const status = String(d.status ?? "Open").trim();
  return { name, company, amount, contact, date, status };
}

const DEFAULT_STAGES = ["Open", "Quotation", "Negotiation", "Won", "Lost"];

/* ------------------------------------------------------------------ */
/*  Skeleton loading state                                             */
/* ------------------------------------------------------------------ */

function KanbanSkeleton() {
  return (
    <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="min-w-[280px] flex-1 rounded-xl border p-3"
          style={{
            borderColor: "var(--color-border-subtle)",
            background: "var(--color-ground-muted)",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div
              className="h-4 w-20 animate-pulse rounded"
              style={{ background: "var(--color-border)" }}
            />
            <div
              className="h-3 w-16 animate-pulse rounded"
              style={{ background: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <SkeletonCard key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CRMPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
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
    fetch("/api/erp/list?doctype=Opportunity")
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Session expired. Please sign in again.");
        }
        if (!res.ok) throw new Error("Failed to load pipeline.");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const raw = (json?.data ?? []) as Record<string, unknown>[];
        setDeals(raw.map(mapErpOpportunity));
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setDeals([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  const columns = useMemo(() => {
    const statuses = Array.from(new Set(deals.map((d) => d.status).filter(Boolean)));
    const order = statuses.length
      ? statuses.sort((a, b) => {
          const ia = DEFAULT_STAGES.indexOf(a);
          const ib = DEFAULT_STAGES.indexOf(b);
          if (ia === -1 && ib === -1) return a.localeCompare(b);
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        })
      : DEFAULT_STAGES;
    return order.map((status) => {
      const items = deals.filter((d) => d.status === status);
      const total = items.reduce((sum, d) => sum + d.amount, 0);
      return {
        id: status,
        title: status,
        count: items.length,
        total,
        deals: items,
      };
    });
  }, [deals]);

  /* ---------- Error state ---------- */
  if (error) {
    return (
      <div>
        <PageHeader title="CRM Pipeline" description="Track deals through your sales pipeline" />
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
            <Briefcase className="h-6 w-6" />
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
      <PageHeader
        title="CRM Pipeline"
        description="Track deals through your sales pipeline"
        action={
          <a href="/dashboard/crm/new">
            <Button variant="primary" size="md">
              Add Opportunity
            </Button>
          </a>
        }
      />

      {/* Loading */}
      {loading ? (
        <KanbanSkeleton />
      ) : deals.length === 0 ? (
        /* Empty state */
        <div
          className="mt-6 rounded-xl border"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-ground-elevated)",
          }}
        >
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title={MODULE_EMPTY_STATES.crm.title}
            description={MODULE_EMPTY_STATES.crm.description}
            actionLabel={MODULE_EMPTY_STATES.crm.actionLabel}
            actionHref={MODULE_EMPTY_STATES.crm.actionLink}
            supportLine={EMPTY_STATE_SUPPORT_LINE}
          />
        </div>
      ) : (
        /* Kanban board */
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <div
              key={col.id}
              className="min-w-[280px] flex-1 rounded-xl border p-3"
              style={{
                borderColor: "var(--color-border-subtle)",
                background: "var(--color-ground-muted)",
              }}
            >
              {/* Column header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {col.title}
                  </h2>
                  <Badge status={col.title}>{col.count}</Badge>
                </div>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-ink-tertiary)" }}
                >
                  {col.total > 0 ? formatCurrency(col.total, "USD") : "\u2014"}
                </span>
              </div>

              {/* Deal cards */}
              <div className="space-y-3">
                {col.deals.map((deal) => (
                  <div
                    key={deal.name}
                    className="cursor-pointer rounded-lg border p-4 transition-colors duration-100"
                    style={{
                      borderColor: "var(--color-border)",
                      background: "var(--color-ground-elevated)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border-subtle)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    <p
                      className="font-medium text-sm"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {deal.company}
                    </p>
                    <p
                      className="mt-0.5 text-sm"
                      style={{ color: "var(--color-ink-secondary)" }}
                    >
                      {deal.amount > 0 ? formatCurrency(deal.amount, "USD") : "\u2014"}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-ink-tertiary)" }}
                      >
                        {deal.contact}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium"
                          style={{
                            background: "var(--color-ground-muted)",
                            color: "var(--color-ink-secondary)",
                          }}
                        >
                          {initials(deal.contact)}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-ink-tertiary)" }}
                        >
                          {deal.date ? formatDate(deal.date) : "\u2014"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {col.deals.length === 0 && (
                  <p
                    className="py-8 text-center text-xs"
                    style={{ color: "var(--color-ink-tertiary)" }}
                  >
                    No deals
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
