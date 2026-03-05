"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-sm",
  md: "h-9 px-5 text-[0.9375rem]",
  lg: "h-11 px-7 text-[0.9375rem]",
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white border-transparent hover:bg-[var(--color-primary-hover)] shadow-[var(--shadow-button)] active:scale-[0.97]",
  secondary:
    "bg-transparent text-[var(--color-ink-secondary)] border border-[var(--color-border)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink-muted)] hover:bg-[var(--color-ground-section)]",
  danger:
    "bg-[var(--color-error)] text-white border-transparent hover:opacity-90",
  ghost:
    "bg-transparent text-[var(--color-ink-secondary)] border-transparent hover:bg-[var(--color-ground-section)] hover:text-[var(--color-ink)]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled ?? loading;
    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold transition-all duration-150",
          SIZE_CLASS[size],
          VARIANT_CLASS[variant],
          isDisabled && "cursor-not-allowed opacity-50",
          className,
        ].filter(Boolean).join(" ")}
        style={{ transitionProperty: "min-width, opacity, transform" }}
        {...props}
      >
        {loading ? (
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
