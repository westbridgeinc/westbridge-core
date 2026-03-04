"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, perPage, total, onChange, className = "" }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = Math.min((page - 1) * perPage + 1, total);
  const end = Math.min(page * perPage, total);

  if (total <= 0) return null;

  return (
    <div
      className={`flex items-center justify-between ${className}`}
      style={{ color: "var(--color-ink-tertiary)" }}
    >
      <span className="text-[var(--font-caption)]">
        {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-150 hover:bg-[var(--color-ground-muted)] disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-2 text-[var(--font-caption)] font-medium" style={{ color: "var(--color-ink-secondary)" }}>
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-150 hover:bg-[var(--color-ground-muted)] disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
