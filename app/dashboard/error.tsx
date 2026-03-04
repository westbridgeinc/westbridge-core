"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/config/site";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    import("@/lib/reporter").then(({ reportError }) =>
      reportError(error, { boundary: "dashboard" })
    );
  }, [error]);

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-6"
      style={{ background: "var(--color-ground)" }}
    >
      <h2 className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>
        Something went wrong
      </h2>
      <p className="mt-2 text-body text-center max-w-md" style={{ color: "var(--color-ink-secondary)" }}>
        We couldn’t load this section. You can try again or go back to the dashboard.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
        <Link href={ROUTES.dashboard} className="btn-secondary">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
