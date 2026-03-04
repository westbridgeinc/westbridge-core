"use client";

import { useState, useMemo, useCallback, useRef, type ReactNode, type KeyboardEvent } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Pagination } from "./Pagination";
import { SkeletonTable } from "./SkeletonTable";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyState?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyState,
  emptyTitle = "No results",
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  onRowClick,
  pageSize = 20,
  className = "",
}: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [focusedRow, setFocusedRow] = useState(-1);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const handleSort = useCallback(
    (colId: string) => {
      if (sortCol === colId) {
        setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
        if (sortDir === "desc") setSortCol(null);
      } else {
        setSortCol(colId);
        setSortDir("asc");
      }
      setPage(1);
    },
    [sortCol, sortDir]
  );

  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return data;
    const col = columns.find((c) => c.id === sortCol);
    if (!col?.sortValue) return data;
    const fn = col.sortValue;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = fn(a);
      const vb = fn(b);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [data, sortCol, sortDir, columns]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const allSelected = paginated.length > 0 && paginated.every((r) => selectedKeys?.has(keyExtractor(r)));

  const toggleAll = useCallback(() => {
    if (!onSelectionChange) return;
    const next = new Set(selectedKeys);
    if (allSelected) {
      paginated.forEach((r) => next.delete(keyExtractor(r)));
    } else {
      paginated.forEach((r) => next.add(keyExtractor(r)));
    }
    onSelectionChange(next);
  }, [allSelected, paginated, selectedKeys, onSelectionChange, keyExtractor]);

  const toggleRow = useCallback(
    (key: string) => {
      if (!onSelectionChange) return;
      const next = new Set(selectedKeys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onSelectionChange(next);
    },
    [selectedKeys, onSelectionChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableSectionElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedRow((prev) => Math.min(prev + 1, paginated.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedRow((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && focusedRow >= 0 && onRowClick) {
        e.preventDefault();
        onRowClick(paginated[focusedRow]);
      }
    },
    [focusedRow, paginated, onRowClick]
  );

  if (loading) {
    return <SkeletonTable rows={pageSize > 10 ? 10 : pageSize} columns={columns.length} className={className} />;
  }

  if (data.length === 0) {
    return (
      emptyState ?? (
        <div
          className={`rounded-[var(--radius-md)] border ${className}`}
          style={{ borderColor: "var(--color-border)" }}
        >
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        </div>
      )
    );
  }

  return (
    <div className={className}>
      <div
        className="overflow-hidden rounded-[var(--radius-md)] border"
        style={{ borderColor: "var(--color-border)" }}
      >
        <table className="w-full text-[0.9375rem]">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "var(--color-border)", background: "var(--color-ground-muted)" }}
            >
              {selectable && (
                <th className="w-12 py-3 pl-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded accent-[var(--color-primary)]"
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortCol === col.id;
                const sortable = !!col.sortValue;
                return (
                  <th
                    key={col.id}
                    className={`py-3 px-4 text-[11px] font-semibold uppercase tracking-wider ${
                      sortable ? "cursor-pointer select-none" : ""
                    }`}
                    style={{
                      color: "var(--color-ink-tertiary)",
                      textAlign: col.align ?? "left",
                      width: col.width,
                    }}
                    onClick={sortable ? () => handleSort(col.id) : undefined}
                    aria-sort={isSorted ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {sortable && (
                        <span className="inline-flex flex-col">
                          <ChevronUp
                            className="h-3 w-3 -mb-0.5"
                            style={{ opacity: isSorted && sortDir === "asc" ? 1 : 0.25 }}
                          />
                          <ChevronDown
                            className="h-3 w-3 -mt-0.5"
                            style={{ opacity: isSorted && sortDir === "desc" ? 1 : 0.25 }}
                          />
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody
            ref={tbodyRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="focus:outline-none"
          >
            {paginated.map((row, ri) => {
              const key = keyExtractor(row);
              const isFocused = ri === focusedRow;
              const isSelected = selectedKeys?.has(key);
              return (
                <tr
                  key={key}
                  className="border-b transition-colors duration-100"
                  style={{
                    borderColor: "var(--color-border)",
                    background: isSelected
                      ? "rgb(20 184 166 / 0.06)"
                      : isFocused
                        ? "var(--color-ground-muted)"
                        : undefined,
                    cursor: onRowClick ? "pointer" : undefined,
                  }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onMouseEnter={() => setFocusedRow(ri)}
                >
                  {selectable && (
                    <td className="py-3 pl-4">
                      <input
                        type="checkbox"
                        checked={isSelected ?? false}
                        onChange={() => toggleRow(key)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded accent-[var(--color-primary)]"
                        aria-label={`Select row ${key}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className="py-3 px-4"
                      style={{
                        textAlign: col.align ?? "left",
                        color: "var(--color-ink)",
                      }}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length > pageSize && (
        <div className="mt-4">
          <Pagination page={page} perPage={pageSize} total={data.length} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
