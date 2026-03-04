"use client";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  success: { bg: "rgb(34 197 94 / 0.12)", text: "var(--color-success)", border: "rgb(34 197 94 / 0.2)" },
  warning: { bg: "rgb(245 158 11 / 0.12)", text: "var(--color-warning)", border: "rgb(245 158 11 / 0.2)" },
  error: { bg: "rgb(239 68 68 / 0.12)", text: "var(--color-error)", border: "rgb(239 68 68 / 0.2)" },
  info: { bg: "rgb(59 130 246 / 0.12)", text: "var(--color-info)", border: "rgb(59 130 246 / 0.2)" },
  default: { bg: "var(--color-ground-muted)", text: "var(--color-ink-tertiary)", border: "var(--color-border-subtle)" },
};

/** Map common status strings to badge variants */
const STATUS_MAP: Record<string, BadgeVariant> = {
  Paid: "success",
  Active: "success",
  Approved: "success",
  Processed: "success",
  Completed: "success",
  Complete: "success",
  Unpaid: "warning",
  Pending: "warning",
  Open: "warning",
  "In Progress": "warning",
  Overdue: "error",
  Rejected: "error",
  Cancelled: "error",
  Expired: "error",
  Sent: "info",
  Submitted: "info",
  Draft: "default",
  Inactive: "default",
  Closed: "default",
};

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Auto-detect variant from status string */
  status?: string;
  className?: string;
}

export function Badge({ children, variant, status, className = "" }: BadgeProps) {
  const resolved = variant ?? STATUS_MAP[status ?? ""] ?? "default";
  const styles = VARIANT_STYLES[resolved];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-5 ${className}`}
      style={{
        background: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
      }}
    >
      {children}
    </span>
  );
}
