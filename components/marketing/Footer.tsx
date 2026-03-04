import Link from "next/link";
import Image from "next/image";
import { SITE, ROUTES } from "@/lib/config/site";

export function Footer() {
  return (
    <footer
      className="border-t py-12"
      style={{
        borderColor: "var(--color-surface-dark-border)",
        background: "var(--color-surface-dark)",
      }}
    >
      <div
        className="mx-auto flex flex-col items-center justify-between gap-6 px-[var(--space-container)] sm:flex-row"
        style={{ maxWidth: "var(--max-width)" }}
      >
        <div className="flex items-center gap-4">
          <Image
            src={SITE.logoPath}
            alt={`${SITE.name} ${SITE.legal}`}
            width={120}
            height={36}
            className="h-8 w-auto object-contain brightness-0 invert opacity-90"
          />
          <p className="text-caption" style={{ color: "var(--color-ink-muted)" }}>
            © 2026 {SITE.name} {SITE.legal}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-body sm:justify-end" style={{ color: "var(--color-ink-muted)" }}>
          <Link href={ROUTES.pricing} className="transition-colors hover:text-white">
            Pricing
          </Link>
          <Link href={ROUTES.modules} className="transition-colors hover:text-white">
            Modules
          </Link>
          <Link href={ROUTES.about} className="transition-colors hover:text-white">
            About
          </Link>
          <Link href={ROUTES.terms} className="transition-colors hover:text-white">
            Terms
          </Link>
          <Link href={ROUTES.privacy} className="transition-colors hover:text-white">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
