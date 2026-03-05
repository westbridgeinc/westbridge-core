"use client";

import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  /** Muted text below the action, e.g. "Need help? Contact support@..." */
  supportLine?: string;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, actionHref, supportLine }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: "var(--color-ground-muted)", color: "var(--color-ink-tertiary)" }}
        >
          {icon}
        </div>
      )}
      <h3 className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-body" style={{ color: "var(--color-ink-secondary)" }}>
          {description}
        </p>
      )}
      {actionLabel && (onAction || actionHref) && (
        <div className="mt-6">
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="primary" size="md">{actionLabel}</Button>
            </a>
          ) : (
            <Button variant="primary" size="md" onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      )}
      {supportLine && (
        <p className="mt-4 text-caption" style={{ color: "var(--color-ink-tertiary)" }}>
          {supportLine}
        </p>
      )}
    </div>
  );
}
