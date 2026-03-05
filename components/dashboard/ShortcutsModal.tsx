"use client";

import { Modal } from "@/components/ui/Modal";

const ROWS: { keys: string; label: string }[] = [
  { keys: "Ctrl+K", label: "Command palette" },
  { keys: "?", label: "Keyboard shortcuts (this help)" },
  { keys: "G then D", label: "Dashboard" },
  { keys: "G then I", label: "Invoices" },
  { keys: "G then A", label: "Accounting" },
  { keys: "G then E", label: "Expenses" },
  { keys: "G then C", label: "CRM" },
  { keys: "G then Q", label: "Quotations" },
  { keys: "G then N", label: "Inventory" },
  { keys: "G then P", label: "Procurement" },
  { keys: "G then H", label: "HR" },
  { keys: "G then R", label: "Payroll" },
  { keys: "G then Y", label: "Analytics" },
  { keys: "G then S", label: "Settings" },
  { keys: "N", label: "Notifications" },
];

export function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard shortcuts">
      <div className="space-y-1">
        {ROWS.map((row) => (
          <div
            key={row.keys}
            className="flex items-center justify-between gap-4 py-2"
            style={{ borderColor: "var(--color-border-subtle)" }}
          >
            <span className="text-body" style={{ color: "var(--color-ink-secondary)" }}>
              {row.label}
            </span>
            <kbd
              className="rounded border px-2 py-1 text-[0.8125rem] font-medium"
              style={{ borderColor: "var(--color-border)", color: "var(--color-ink-tertiary)" }}
            >
              {row.keys}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
