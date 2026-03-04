"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Calculator,
  Receipt,
  Users,
  FileBarChart,
  Package,
  Truck,
  UserCog,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Clock,
} from "lucide-react";

type ActionItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "Navigation" | "Quick Actions";
};

const ACTIONS: ActionItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText, group: "Navigation" },
  { label: "Accounting", href: "/dashboard/accounting", icon: Calculator, group: "Navigation" },
  { label: "Expenses", href: "/dashboard/expenses", icon: Receipt, group: "Navigation" },
  { label: "CRM", href: "/dashboard/crm", icon: Users, group: "Navigation" },
  { label: "Quotations", href: "/dashboard/quotations", icon: FileBarChart, group: "Navigation" },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package, group: "Navigation" },
  { label: "Procurement", href: "/dashboard/procurement", icon: Truck, group: "Navigation" },
  { label: "HR", href: "/dashboard/hr", icon: UserCog, group: "Navigation" },
  { label: "Payroll", href: "/dashboard/payroll", icon: DollarSign, group: "Navigation" },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, group: "Navigation" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, group: "Navigation" },
  { label: "New Invoice", href: "/dashboard/invoices?action=new", icon: Plus, group: "Quick Actions" },
  { label: "New Quote", href: "/dashboard/quotations?action=new", icon: Plus, group: "Quick Actions" },
  { label: "New Purchase Order", href: "/dashboard/procurement?action=new", icon: Plus, group: "Quick Actions" },
];

const GROUPS: ActionItem["group"][] = ["Navigation", "Quick Actions"];

const RECENT_KEY = "wb_cmd_recent";
const MAX_RECENT = 5;

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(href: string) {
  try {
    const prev = getRecent().filter((h) => h !== href);
    localStorage.setItem(RECENT_KEY, JSON.stringify([href, ...prev].slice(0, MAX_RECENT)));
  } catch {
    /* noop */
  }
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? ACTIONS.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : ACTIONS;

  // Build flat list for keyboard nav, with group headers tracked separately
  const { flatItems, groupStartIndices } = useMemo(() => {
    const flat: ActionItem[] = [];
    const starts: { group: string; index: number }[] = [];
    for (const g of GROUPS) {
      const items = filtered.filter((a) => a.group === g);
      if (items.length === 0) continue;
      starts.push({ group: g, index: flat.length });
      flat.push(...items);
    }
    return { flatItems: flat, groupStartIndices: starts };
  }, [filtered]);

  // Recent items for empty query state
  const recentHrefs = getRecent();
  const recentItems = recentHrefs.map((h) => ACTIONS.find((a) => a.href === h)).filter(Boolean) as ActionItem[];

  const select = useCallback(
    (item: ActionItem) => {
      saveRecent(item.href);
      router.push(item.href);
      onClose();
    },
    [router, onClose]
  );

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setQuery("");
      setSelected(0);
      inputRef.current?.focus();
    });
  }, [open]);

  useEffect(() => {
    queueMicrotask(() => setSelected(0));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => (s + 1) % Math.max(1, flatItems.length));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => (s - 1 + flatItems.length) % Math.max(1, flatItems.length));
        return;
      }
      if (e.key === "Enter" && flatItems[selected]) {
        e.preventDefault();
        select(flatItems[selected]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, flatItems, selected, select, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-xl rounded-xl border shadow-2xl"
        style={{
          background: "var(--color-ground-elevated)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--color-border)" }}>
          <span className="text-[var(--color-ink-tertiary)]">⌘K</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules and actions…"
            className="min-w-0 flex-1 bg-transparent text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none"
            autoFocus
          />
        </div>
        <div className="max-h-[60vh] overflow-auto py-2">
          {flatItems.length === 0 ? (
            <p className="px-4 py-6 text-center text-body" style={{ color: "var(--color-ink-tertiary)" }}>
              No results. Try another search.
            </p>
          ) : (
            <>
              {/* Recent searches (only when no query) */}
              {!query.trim() && recentItems.length > 0 && (
                <div className="mb-1">
                  <p
                    className="flex items-center gap-1.5 px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    <Clock className="h-3 w-3" />
                    Recent
                  </p>
                  {recentItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={`recent-${item.href}`}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          select(item);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-body"
                        style={{ color: "var(--color-ink-secondary)" }}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-50" />
                        <span className="text-[0.8125rem]">{item.label}</span>
                      </Link>
                    );
                  })}
                  <div className="mx-4 my-1 border-b" style={{ borderColor: "var(--color-border)" }} />
                </div>
              )}

              {/* Grouped results */}
              {groupStartIndices.map(({ group, index: startIdx }) => {
                const nextGroup = groupStartIndices.find((g) => g.index > startIdx);
                const endIdx = nextGroup ? nextGroup.index : flatItems.length;
                const groupItems = flatItems.slice(startIdx, endIdx);

                return (
                  <div key={group} className="mb-1">
                    <p
                      className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      {group}
                    </p>
                    <ul>
                      {groupItems.map((item, i) => {
                        const globalIdx = startIdx + i;
                        const Icon = item.icon;
                        const isSelected = globalIdx === selected;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                select(item);
                              }}
                              className={`flex items-center gap-3 px-4 py-2.5 text-body ${
                                isSelected ? "bg-[var(--color-ground-section)]" : ""
                              }`}
                              style={{
                                color: isSelected ? "var(--color-ink)" : "var(--color-ink-secondary)",
                                borderLeft: isSelected ? "3px solid var(--color-accent)" : "3px solid transparent",
                              }}
                            >
                              <Icon className="h-5 w-5 shrink-0 opacity-70" />
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div
          className="flex items-center justify-between border-t px-4 py-2 text-[11px]"
          style={{ borderColor: "var(--color-border)", color: "var(--color-ink-muted)" }}
        >
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
