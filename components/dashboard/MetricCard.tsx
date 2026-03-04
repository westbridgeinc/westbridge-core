interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  subtextVariant?: "default" | "success" | "error" | "muted";
}

export function MetricCard({ label, value, subtext, subtextVariant = "muted" }: MetricCardProps) {
  const subtextColor =
    subtextVariant === "success"
      ? "var(--color-success)"
      : subtextVariant === "error"
        ? "var(--color-error)"
        : subtextVariant === "default"
          ? "var(--color-ink-secondary)"
          : "var(--color-ink-tertiary)";

  return (
    <div className="card">
      <p className="text-label" style={{ color: "var(--color-ink-tertiary)" }}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
        {value}
      </p>
      {subtext != null && (
        <p className="mt-1 text-caption" style={{ color: subtextColor }}>
          {subtext}
        </p>
      )}
    </div>
  );
}
