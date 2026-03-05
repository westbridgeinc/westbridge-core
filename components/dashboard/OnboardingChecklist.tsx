"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";

const STORAGE_DISMISSED = "wb_onboarding_dismissed";
const STORAGE_IMPORT = "wb_onboarding_import_done";
const STORAGE_INVITE = "wb_onboarding_invite_done";

const STEPS = [
  { id: "erp", label: "Connect your ERPNext instance", href: "/dashboard/settings", storageKey: null },
  { id: "employee", label: "Add your first employee", href: "/dashboard/hr", storageKey: null },
  { id: "invoice", label: "Create your first invoice", href: "/dashboard/invoices", storageKey: null },
  { id: "accounts", label: "Set up your chart of accounts", href: "/dashboard/accounting", storageKey: null },
  { id: "import", label: "Import existing data", href: "/dashboard/settings?tab=general", storageKey: STORAGE_IMPORT },
  { id: "invite", label: "Invite your team", href: "/dashboard/settings?tab=team", storageKey: STORAGE_INVITE },
] as const;

async function checkErpConnected(): Promise<boolean> {
  try {
    const res = await fetch("/api/erp/list?doctype=Company&limit_page_length=1");
    return res.ok;
  } catch {
    return false;
  }
}

async function checkErpListHasRows(doctype: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/erp/list?doctype=${encodeURIComponent(doctype)}&limit_page_length=1`);
    if (!res.ok) return false;
    const json = await res.json();
    const data = json.data;
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

export function OnboardingChecklist({ checklistRef }: { checklistRef?: React.RefObject<HTMLDivElement | null> }) {
  const [dismissed, setDismissed] = useState(true); // start true to avoid flash, then set from storage
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const loadState = useCallback(async () => {
    if (typeof window === "undefined") return;
    const dismissedVal = localStorage.getItem(STORAGE_DISMISSED) === "true";
    setDismissed(dismissedVal);
    if (dismissedVal) {
      setLoading(false);
      return;
    }

    const [erpConnected, hasEmployees, hasInvoices, hasAccounts] = await Promise.all([
      checkErpConnected(),
      checkErpListHasRows("Employee"),
      checkErpListHasRows("Sales Invoice"),
      checkErpListHasRows("Account"),
    ]);

    const importDone = localStorage.getItem(STORAGE_IMPORT) === "true";
    const inviteDone = localStorage.getItem(STORAGE_INVITE) === "true";

    setCompleted({
      erp: erpConnected,
      employee: hasEmployees,
      invoice: hasInvoices,
      accounts: hasAccounts,
      import: importDone,
      invite: inviteDone,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_DISMISSED, "true");
    setDismissed(true);
  };

  if (loading || dismissed) return null;

  const completedCount = STEPS.filter((s) => completed[s.id]).length;
  const total = STEPS.length;
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (completedCount / total) * circumference;

  return (
    <motion.div
      ref={checklistRef}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-8 rounded-[var(--radius-md)] border p-5"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-ground-elevated)",
        borderLeftWidth: 4,
        borderLeftColor: "var(--color-accent)",
        boxShadow: "0 0 0 1px rgba(20, 184, 166, 0.08)",
      }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="4"
              />
              <motion.circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </svg>
          </div>
          <div>
            <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>
              Get started with Westbridge
            </p>
            <p className="text-body mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>
              {completedCount} of {total} complete
            </p>
          </div>
        </div>

        <ul className="flex-1 space-y-1">
          {STEPS.map((step) => {
            const done = completed[step.id];
            return (
              <li key={step.id}>
                <Link
                  href={step.href}
                  prefetch={true}
                  className="group flex items-center justify-between gap-2 rounded-lg py-2.5 pr-2 transition-colors hover:bg-[var(--color-ground-muted)]"
                >
                  <span className="flex items-center gap-3">
                    <AnimatePresence mode="wait">
                      {done ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                          style={{ background: "var(--color-accent)", color: "var(--color-ground)" }}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="dot"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: "var(--color-ink-tertiary)" }}
                        />
                      )}
                    </AnimatePresence>
                    <span
                      className="text-body font-medium"
                      style={{
                        color: done ? "var(--color-ink-tertiary)" : "var(--color-ink-secondary)",
                        textDecoration: done ? "line-through" : undefined,
                      }}
                    >
                      {step.label}
                    </span>
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: "var(--color-ink-tertiary)" }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-caption font-medium transition-opacity hover:opacity-100"
          style={{ color: "var(--color-ink-tertiary)" }}
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}
