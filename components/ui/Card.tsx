"use client";

import { type HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional padding override */
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING_CLASS = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padding = "md", className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        "rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-ground)] shadow-[var(--shadow-card)] transition-[box-shadow,border-color] duration-150",
        PADDING_CLASS[padding],
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";
