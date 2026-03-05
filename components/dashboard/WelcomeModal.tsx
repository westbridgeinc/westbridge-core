"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Server, LayoutGrid, Users } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

const STORAGE_WELCOMED = "wb_welcomed";

const CARDS = [
  {
    title: "Connect ERPNext",
    description: "Link your ERPNext instance to sync data",
    icon: Server,
    href: "/dashboard/settings",
  },
  {
    title: "Explore modules",
    description: "Browse 38+ modules tailored for Caribbean business",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    title: "Invite your team",
    description: "Add team members and set permissions",
    icon: Users,
    href: "/dashboard/settings?tab=team",
  },
];

export function WelcomeModal({
  open,
  onClose,
  onGetStarted,
}: {
  open: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}) {
  useEffect(() => {
    if (open) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_WELCOMED, "true");
      }
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Welcome to Westbridge" className="max-w-xl">
      <div className="px-6 pb-6">
        <p className="text-body mt-1" style={{ color: "var(--color-ink-secondary)" }}>
          Your workspace is ready. Here&apos;s how to get the most out of it in your first 10 minutes.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                prefetch={true}
                onClick={onClose}
                className="flex flex-col rounded-[var(--radius-md)] border p-4 text-left transition-colors hover:bg-[var(--color-ground-muted)]"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "var(--color-ground-muted)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "var(--color-accent)" }} />
                </span>
                <span className="text-body font-semibold mt-3" style={{ color: "var(--color-ink)" }}>
                  {card.title}
                </span>
                <span className="text-caption mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>
                  {card.description}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="btn-primary"
          >
            Get started
          </button>
        </div>
      </div>
    </Modal>
  );
}

