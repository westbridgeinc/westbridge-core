"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastVariant = "success" | "warning" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: { label: string; onClick: () => void };
  persist?: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant, options?: { action?: Toast["action"]; persist?: boolean }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION_MS = 5000;

export function useToasts() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toasts: [], addToast: () => {}, removeToast: () => {} };
  return ctx;
}

export function ToastsProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      message: string,
      variant: ToastVariant = "info",
      options?: { action?: Toast["action"]; persist?: boolean }
    ) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          variant,
          action: options?.action,
          persist: options?.persist ?? variant === "error",
        },
      ]);
      if (!options?.persist && variant !== "error") {
        setTimeout(() => {
          setToasts((p) => p.filter((t) => t.id !== id));
        }, TOAST_DURATION_MS);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  function ToastProgressBar({ variant, persist }: { variant: ToastVariant; persist?: boolean }) {
  if (persist) return null;

  const barColor =
    variant === "error"
      ? "var(--color-error)"
      : variant === "success"
        ? "var(--color-success)"
        : variant === "warning"
          ? "var(--color-warning)"
          : "var(--color-accent)";

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-lg"
      style={{ background: "var(--color-ground-muted)" }}
    >
      <motion.div
        className="h-full rounded-b-lg"
        style={{ background: barColor }}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: TOAST_DURATION_MS / 1000, ease: "linear" }}
      />
    </div>
  );
}

function ToastItem({
  t,
  removeToast,
}: {
  t: Toast;
  removeToast: (id: string) => void;
}) {
  const borderColor =
    t.variant === "error"
      ? "var(--color-error)"
      : t.variant === "success"
        ? "var(--color-success)"
        : t.variant === "warning"
          ? "var(--color-warning)"
          : "var(--color-border)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex min-w-[280px] max-w-sm items-start justify-between gap-3 overflow-hidden rounded-lg border px-4 py-3 shadow-lg"
      style={{
        background: "var(--color-ground-elevated)",
        borderColor,
      }}
    >
      <p className="text-body" style={{ color: "var(--color-ink)" }}>
        {t.message}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        {t.action && (
          <button
            type="button"
            onClick={() => {
              t.action?.onClick();
              removeToast(t.id);
            }}
            className="text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--color-accent)" }}
          >
            {t.action.label}
          </button>
        )}
        <button
          type="button"
          onClick={() => removeToast(t.id)}
          className="rounded p-1 transition-opacity hover:opacity-70"
          aria-label="Dismiss"
        >
          <span className="text-[var(--color-ink-tertiary)]">×</span>
        </button>
      </div>
      <ToastProgressBar variant={t.variant} persist={t.persist} />
    </motion.div>
  );
}

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} removeToast={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
