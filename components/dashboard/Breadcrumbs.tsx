import Link from "next/link";
import { ROUTES } from "@/lib/config/site";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption" style={{ color: "var(--color-ink-tertiary)" }}>
      <Link href={ROUTES.dashboard} className="transition-colors hover:opacity-100" style={{ color: "var(--color-ink-muted)" }}>
        Dashboard
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span aria-hidden>/</span>
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:opacity-100" style={{ color: "var(--color-ink-muted)" }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--color-ink-secondary)" }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
