"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/config/site";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const cards = [
  {
    title: "Modern stack",
    description: "Built for local compliance, multi-currency, and your workflows from day one.",
  },
  {
    title: "AI Native",
    description: "AI assistant and automation built into the platform, not bolted on.",
  },
  {
    title: "Simple pricing",
    description: "Pick the modules you need. One subscription, no surprises.",
  },
];

export default function AboutContent() {
  return (
    <div className="mx-auto max-w-6xl px-[var(--space-container)] py-24" style={{ background: "var(--color-ground)" }}>
      <motion.div {...fadeUp}>
        <h1 className="text-4xl font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
          Built for growing businesses
        </h1>
      </motion.div>

      <motion.div {...fadeUp} className="mt-8 max-w-2xl text-body" style={{ color: "var(--color-ink-secondary)" }}>
        <p className="mt-4 leading-relaxed">
          Westbridge was built to give businesses the same enterprise tools that Fortune 500 companies use — invoicing, inventory, HR, payroll, CRM, and analytics — without the complexity or the price tag of legacy software.
        </p>
        <p className="mt-4 leading-relaxed">
          We started because we saw too many businesses running on spreadsheets, siloed systems, and workarounds. Our platform is designed for USD and the way modern businesses operate.
        </p>
      </motion.div>

      <div className="mt-20 grid gap-6 lg:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            {...fadeUp}
            transition={{ delay: i * 0.08 }}
            className="card"
          >
            <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>{card.title}</p>
            <p className="mt-2 text-body" style={{ color: "var(--color-ink-secondary)" }}>{card.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp} className="mt-24 rounded-2xl py-16 text-center text-white" style={{ background: "var(--color-surface-dark)" }}>
        <h2 className="text-2xl font-semibold tracking-tight">Ready to get started?</h2>
        <Link
          href={ROUTES.signup}
          className="mt-4 inline-block rounded-md px-5 py-2.5 text-sm font-medium transition hover:opacity-90"
          style={{ background: "white", color: "var(--color-ink)" }}
        >
          Start free trial
        </Link>
      </motion.div>
    </div>
  );
}
