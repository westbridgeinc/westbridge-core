"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES, SITE } from "@/lib/config/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    import("@/lib/reporter").then(({ reportError }) =>
      reportError(error, { boundary: "app" })
    );
  }, [error]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: "var(--color-ground)" }}
    >
      <h1 className="text-h2 font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
        Something went wrong
      </h1>
      <p className="mt-2 text-body text-center max-w-md" style={{ color: "var(--color-ink-secondary)" }}>
        We could not load this page. You can try again or return home.
      </p>
      <div className="mt-8 flex gap-4">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href={ROUTES.home} className="btn-secondary">
          Back to {SITE.name}
        </Link>
      </div>
    </div>
  );
}
