"use client";

import { Skeleton } from "./Skeleton";

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 5, className = "" }: SkeletonTableProps) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-md)] border ${className}`}
      style={{ borderColor: "var(--color-border)" }}
    >
      <div
        className="border-b px-6 py-3"
        style={{ borderColor: "var(--color-border)", background: "var(--color-ground-muted)" }}
      >
        <div className="flex items-center gap-6">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} height={12} width={i === 0 ? 100 : i === columns - 1 ? 80 : 120} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, ri) => (
        <div
          key={ri}
          className="flex items-center gap-6 border-b px-6 py-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          {Array.from({ length: columns }).map((_, ci) => (
            <Skeleton
              key={ci}
              height={14}
              width={ci === 0 ? 90 : ci === 1 ? 160 : ci === columns - 1 ? 70 : 100}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
