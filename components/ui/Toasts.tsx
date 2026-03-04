"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

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
        }, 5000);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex min-w-[280px] max-w-sm items-start justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg"
            style={{
              background: "var(--color-ground-elevated)",
              borderColor:
                t.variant === "error"
                  ? "var(--color-error)"
                  : t.variant === "success"
                    ? "var(--color-success)"
                    : t.variant === "warning"
                      ? "var(--color-warning)"
                      : "var(--color-border)",
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
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
