"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MODULES } from "@/lib/modules";
import { ROUTES, TRIAL } from "@/lib/config/site";

const HOMEPAGE_MODULE_IDS = [
  "general-ledger",
  "sales-orders",
  "lead-management",
  "stock-management",
  "employee-management",
  "project-tracking",
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function HomeContent() {
  const homepageModules = HOMEPAGE_MODULE_IDS.map((id) =>
    MODULES.find((m) => m.id === id)
  ).filter(Boolean) as typeof MODULES;

  return (
    <>
      <section
        className="relative overflow-hidden px-[var(--space-container)] py-[clamp(4rem,12vw,7rem)]"
        style={{ background: "var(--color-ground)" }}
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={container}
          >
            <motion.p
              variants={item}
              className="text-label mb-4 font-medium uppercase tracking-wider"
              style={{ color: "var(--color-teal-600)" }}
            >
              ERP for Caribbean business
            </motion.p>
            <motion.h1
              variants={item}
              className="text-display font-bold leading-[1.08] tracking-tight"
              style={{ color: "var(--color-ink)" }}
            >
              The ERP built for Caribbean business.
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-[1.0625rem] leading-[1.65]"
              style={{ color: "var(--color-ink-secondary)" }}
            >
              Invoicing, inventory, HR, payroll, CRM — with AI built in. Designed for Caribbean businesses from day one.
            </motion.p>
            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={ROUTES.signup}
                  className="btn-primary inline-flex h-11 min-w-[140px] items-center justify-center rounded-lg px-7 font-semibold"
                >
                  Start free trial
                </Link>
              </motion.div>
              <Link
                href={ROUTES.pricing}
                className="btn-secondary inline-flex h-11 items-center justify-center rounded-lg px-6"
              >
                See pricing →
              </Link>
            </motion.div>
            <motion.p
              variants={item}
              className="mt-5 text-caption"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Free {TRIAL.days}-day trial · No credit card required · Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section
        className="border-t px-[var(--space-container)] py-[var(--space-section-y)]"
        style={{
          borderColor: "var(--color-border-subtle)",
          background: "var(--color-ground)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
          <motion.div
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={container}
          >
            {[
              { value: "38+", label: "Modules" },
              { value: "7", label: "Caribbean countries" },
              { value: "14%", label: "VAT built-in" },
              { value: "3", label: "Pricing plans" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={item} className="text-center">
                <p className="text-h1 font-bold" style={{ color: "var(--color-ink)" }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-body" style={{ color: "var(--color-ink-secondary)" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="border-t px-[var(--space-container)] py-[var(--space-section-y)]"
        style={{
          borderColor: "var(--color-border-subtle)",
          background: "var(--color-ground-section)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-label mb-2 font-medium uppercase tracking-wider"
            style={{ color: "var(--color-ink-tertiary)" }}
          >
            Platform
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-h2 font-semibold tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            38 modules. One subscription.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-body"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            Pick the modules you need. Add more as you grow.
          </motion.p>
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={container}
          >
            {homepageModules.map((m) => (
              <motion.div key={m.id} variants={item} className="card cursor-default">
                <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>
                  {m.name}
                </p>
                <p className="mt-2 text-body leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                  {m.description}
                </p>
                <p className="mt-4 text-caption">${m.addOnPricePerMonth}/mo add-on</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="px-[var(--space-container)] py-[var(--space-section-y)]"
        style={{ background: "var(--color-ground-elevated)" }}
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-h2 font-semibold tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Built for the Caribbean, not retrofitted
          </motion.h2>
          <motion.div
            className="mt-12 grid gap-6 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
          >
            {[
              { title: "Multi-currency", body: "GYD default with USD and multi-currency support for invoices, payroll, and reporting." },
              { title: "Tax & compliance", body: "Sales tax, withholding, and configurable tax rules for your region." },
              { title: "WhatsApp native", body: "Business notifications and updates via WhatsApp." },
            ].map((block) => (
              <motion.div key={block.title} variants={item} className="card">
                <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>
                  {block.title}
                </p>
                <p className="mt-3 text-body leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                  {block.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="relative overflow-hidden px-[var(--space-container)] py-[var(--space-section-y)]"
        style={{ background: "var(--color-surface-dark)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, white, transparent)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl text-center"
        >
          <h2 className="text-h2 font-semibold tracking-tight text-white">
            Ready to modernize your business?
          </h2>
          <p className="mt-3 text-body" style={{ color: "var(--color-ink-muted)" }}>
            Start your {TRIAL.days}-day free trial. No credit card required.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
            <Link
              href={ROUTES.signup}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-7 text-[0.9375rem] font-semibold text-[var(--color-ink)] transition-shadow hover:shadow-lg"
            >
              Start free trial
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
