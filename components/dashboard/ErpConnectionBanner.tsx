"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";
import { useErpConnection } from "./ErpConnectionContext";

const STORAGE_KEY = "wb_erp_banner_dismissed";
const TTL_MS = 24 * 60 * 60 * 1000;

function getDismissedUntil(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const t = parseInt(raw, 10);
  return Number.isFinite(t) ? t : null;
}

function setDismissedUntil() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(Date.now() + TTL_MS));
}

export function ErpConnectionBanner() {
  const pathname = usePathname();
  const { connected } = useErpConnection();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const until = getDismissedUntil();
    if (until !== null && Date.now() < until) {
      setDismissed(true);
      return;
    }
    setDismissed(false);
  }, []);

  const hideSettings = pathname === "/dashboard/settings";
  const show = !hideSettings && connected === false && !dismissed;

  const handleDismiss = () => {
    setDismissed(true);
    setDismissedUntil();
  };

  if (!show) return null;

  return (
    <div
      className="mb-6 flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-l-4 py-3 pl-4 pr-3"
      style={{
        borderColor: "var(--color-border)",
        borderLeftColor: "var(--color-warning)",
        background: "var(--color-ground-elevated)",
      }}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: "var(--color-warning)" }} />
        <p className="text-body" style={{ color: "var(--color-ink)" }}>
          ERPNext is not connected. Some features require an active ERPNext instance.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/dashboard/settings"
          prefetch={true}
          className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:opacity-90"
          style={{
            color: "var(--color-ink)",
            background: "var(--color-ground-muted)",
          }}
        >
          Configure in Settings
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-ground-muted)]"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" style={{ color: "var(--color-ink-tertiary)" }} />
        </button>
      </div>
    </div>
  );
}
