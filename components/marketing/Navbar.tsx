"use client";

import Link from "next/link";
import Image from "next/image";
import { SITE, ROUTES } from "@/lib/config/site";

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-10 border-b transition-colors"
      style={{
        borderColor: "var(--color-border-subtle)",
        background: "hsla(0, 0%, 100%, 0.9)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{ maxWidth: "var(--max-width)", padding: "16px var(--space-container)" }}
      >
        <Link href={ROUTES.home} className="flex shrink-0 items-center transition-opacity hover:opacity-85">
          <Image
            src={SITE.logoPath}
            alt={`${SITE.name} ${SITE.legal}`}
            width={160}
            height={48}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href={ROUTES.pricing}
            className="text-body font-medium transition-colors hover:opacity-100"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            Pricing
          </Link>
          <Link
            href={ROUTES.modules}
            className="text-body font-medium transition-colors hover:opacity-100"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            Modules
          </Link>
          <Link
            href={ROUTES.about}
            className="text-body font-medium transition-colors hover:opacity-100"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            About
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.login}
            className="text-body font-medium transition-colors hover:opacity-100"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            Sign in
          </Link>
          <Link href={ROUTES.signup} className="btn-primary">
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
