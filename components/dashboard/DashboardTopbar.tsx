"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, FileText, UserPlus } from "lucide-react";
import { DashboardBreadcrumbs } from "./DashboardBreadcrumbs";
import { CommandPalette } from "./CommandPalette";

export function DashboardTopbar() {
  const [openCommand, setOpenCommand] = useState(false);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpenCommand((v) => !v);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <>
      <header
        className="sticky top-0 z-[9] flex items-center justify-between gap-4 border-b py-4"
        style={{ borderColor: "var(--color-border)", background: "var(--color-ground)" }}
      >
        <div className="min-w-0 flex-1">
          <DashboardBreadcrumbs />
        </div>
        <button
          type="button"
          onClick={() => setOpenCommand(true)}
          className="flex max-w-md flex-1 items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-body transition-colors hover:bg-[var(--color-ground-section)]"
          style={{ borderColor: "var(--color-border)", color: "var(--color-ink-tertiary)" }}
        >
          <Search className="h-4 w-4 shrink-0 opacity-70" />
          <span>Search modules, records…</span>
          <kbd className="ml-auto hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block" style={{ borderColor: "var(--color-border)" }}>
            ⌘K
          </kbd>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/dashboard/invoices"
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-ground-section)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">New Invoice</span>
          </Link>
          <Link
            href="/dashboard/crm"
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-ground-section)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Contact</span>
          </Link>
          <button
            type="button"
            className="rounded-lg border p-2 transition-colors hover:bg-[var(--color-ground-section)]"
            style={{ borderColor: "var(--color-border)" }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" style={{ color: "var(--color-ink-secondary)" }} />
          </button>
        </div>
      </header>
      <CommandPalette open={openCommand} onClose={() => setOpenCommand(false)} />
    </>
  );
}
