"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE, ROUTES } from "@/lib/config/site";

const navLinks = [
  { href: ROUTES.pricing, label: "Pricing" },
  { href: ROUTES.modules, label: "Modules" },
  { href: ROUTES.about, label: "About" },
];

const SCROLL_COMPACT_THRESHOLD = 100;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_COMPACT_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-10 border-b transition-[box-shadow,padding] duration-200"
      style={{
        borderColor: "var(--color-border-subtle)",
        background: "hsla(0, 0%, 100%, 0.9)",
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between transition-[padding] duration-200"
        style={{
          maxWidth: "var(--max-width)",
          padding: scrolled ? "12px var(--space-container)" : "16px var(--space-container)",
        }}
      >
        <Link href={ROUTES.home} className="flex shrink-0 items-center transition-opacity hover:opacity-85">
          <Image
            src={SITE.logoPath}
            alt={`${SITE.name} ${SITE.legal}`}
            width={160}
            height={48}
            priority
            sizes="(max-width: 768px) 140px, 160px"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body font-medium transition-colors hover:opacity-100"
              style={{ color: "var(--color-ink-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-4 md:flex">
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
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--color-ground-section)] md:hidden"
          style={{ borderColor: "var(--color-border)" }}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" style={{ color: "var(--color-ink-secondary)" }} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.div
              className="fixed inset-x-0 top-0 z-30 flex flex-col border-b md:hidden"
              style={{
                borderColor: "var(--color-border-subtle)",
                background: "var(--color-ground)",
                boxShadow: "var(--shadow-lg)",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-center justify-between px-4 py-4" style={{ paddingLeft: "var(--space-container)", paddingRight: "var(--space-container)" }}>
                <Link href={ROUTES.home} onClick={() => setMobileOpen(false)} className="flex shrink-0 items-center">
                  <Image src={SITE.logoPath} alt={SITE.name} width={140} height={42} sizes="140px" className="h-9 w-auto object-contain" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-ground-section)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" style={{ color: "var(--color-ink-secondary)" }} />
                </button>
              </div>
              <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-8" style={{ paddingLeft: "var(--space-container)", paddingRight: "var(--space-container)" }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex h-14 min-h-[56px] items-center border-b text-body font-medium transition-colors"
                    style={{ color: "var(--color-ink-secondary)", borderColor: "var(--color-border-subtle)" }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={ROUTES.login}
                    onClick={() => setMobileOpen(false)}
                    className="flex h-14 min-h-[56px] items-center justify-center rounded-lg border font-medium transition-colors"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href={ROUTES.signup}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex h-14 min-h-[56px] items-center justify-center"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
