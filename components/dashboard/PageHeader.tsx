import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-h2 font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-body" style={{ color: "var(--color-ink-tertiary)" }}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-4 sm:mt-0">{action}</div>}
    </div>
  );
}
