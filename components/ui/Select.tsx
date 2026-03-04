"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? `select-${generatedId.replace(/:/g, "")}`;
    return (
      <div className="w-full">
        <label
          htmlFor={selectId}
          className="mb-1.5 block font-medium"
          style={{ fontSize: "var(--font-label)", color: "var(--color-ink-secondary)" }}
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          className={[
            "h-12 w-full appearance-none rounded-[var(--radius-sm)] px-4 pr-10 text-[0.9375rem] transition-[border-color,box-shadow] duration-150",
            "bg-[var(--color-input-bg)] border text-[var(--color-ink)]",
            "hover:border-[var(--color-ink-muted)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-ground)]",
            error
              ? "border-[var(--color-error)] focus:border-[var(--color-error)]"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)]",
            className,
          ].filter(Boolean).join(" ")}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737373' d='M6 8.825c-.2 0-.4-.075-.55-.225l-3-3a.776.776 0 0 1 0-1.1.776.776 0 0 1 1.1 0L6 6.95 8.45 4.5a.776.776 0 0 1 1.1 0 .776.776 0 0 1 0 1.1l-3 3c-.15.15-.35.225-.55.225Z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm" style={{ color: "var(--color-error)" }} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1.5" style={{ fontSize: "var(--font-caption)", color: "var(--color-ink-tertiary)" }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
