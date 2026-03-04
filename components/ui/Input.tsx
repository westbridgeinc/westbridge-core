"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? `input-${generatedId.replace(/:/g, "")}`;
    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[var(--font-label)] font-medium text-[var(--color-ink-secondary)]"
          style={{ fontSize: "var(--font-label)" }}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={[
            "h-12 w-full rounded-[var(--radius-sm)] px-4 text-[0.9375rem] transition-[border-color,box-shadow] duration-150",
            "bg-[var(--color-input-bg)] border text-[var(--color-ink)]",
            "placeholder:text-[var(--color-ink-muted)]",
            "hover:border-[var(--color-ink-muted)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-ground)]",
            error
              ? "border-[var(--color-error)] focus:border-[var(--color-error)]"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)]",
            className,
          ].filter(Boolean).join(" ")}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-[var(--font-caption)] text-[var(--color-ink-tertiary)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
