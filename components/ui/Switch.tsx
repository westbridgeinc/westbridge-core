"use client";

import { forwardRef } from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, disabled = false, id, className = "", ...aria }, ref) => {
    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-ground)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        style={{
          borderColor: checked ? "var(--color-accent)" : "var(--color-border)",
          background: checked ? "var(--color-accent)" : "var(--color-ground-muted)",
        }}
        {...aria}
      >
        <span
          className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{
            transform: checked ? "translateX(22px)" : "translateX(2px)",
            marginTop: "1px",
          }}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";
