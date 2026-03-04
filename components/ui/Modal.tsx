"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              role="dialog"
              aria-modal
              aria-label={title}
              className={`relative w-full max-w-lg overflow-hidden rounded-[var(--radius-lg)] border shadow-xl ${className}`}
              style={{
                background: "var(--color-ground-elevated)",
                borderColor: "var(--color-border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <div
                  className="flex items-center justify-between border-b px-6 py-4"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <h2 className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>
                    {title}
                  </h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-ground-muted)]"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" style={{ color: "var(--color-ink-tertiary)" }} />
                  </button>
                </div>
              )}
              <div className="px-6 py-5">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
