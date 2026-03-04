"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  FileText,
  Users,
  Package,
  Truck,
  UserCog,
  FolderKanban,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { MODULES, CATEGORIES, isModuleIncludedInPlan } from "@/lib/modules";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Finance & Accounting": Calculator,
  "Sales & CRM": Users,
  "Inventory & Supply Chain": Package,
  "HR & Payroll": UserCog,
  "Manufacturing": Truck,
  "Project Management": FolderKanban,
  "Other": LayoutGrid,
};

function planLabel(moduleId: string): string {
  if (isModuleIncludedInPlan(moduleId, "enterprise")) return "All plans";
  if (isModuleIncludedInPlan(moduleId, "professional")) return "Pro + Enterprise";
  if (isModuleIncludedInPlan(moduleId, "starter")) return "Starter +";
  return "Add-on";
}

export default function ModulesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const filtered =
    activeCategory === "All"
      ? MODULES
      : MODULES.filter((m) => m.category === activeCategory);

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-[var(--space-container)] py-12">
      <h1 className="text-h1 font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
        Module catalog
      </h1>
      <p className="mt-2 text-body" style={{ color: "var(--color-ink-secondary)" }}>
        38 modules. Pick what you need — included in your plan or add-on.
      </p>

      <div className="mt-8 overflow-x-auto border-b pb-4" style={{ borderColor: "var(--color-border-subtle)" }}>
        <div className="flex min-w-0 gap-6">
          <button
            onClick={() => setActiveCategory("All")}
            className={`whitespace-nowrap border-b-2 pb-2 text-body font-medium transition-colors ${
              activeCategory === "All" ? "border-[var(--color-primary)]" : "border-transparent"
            }`}
            style={{ color: activeCategory === "All" ? "var(--color-ink)" : "var(--color-ink-secondary)" }}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap border-b-2 pb-2 text-body font-medium transition-colors ${
                activeCategory === cat ? "border-[var(--color-primary)]" : "border-transparent"
              }`}
              style={{ color: activeCategory === cat ? "var(--color-ink)" : "var(--color-ink-secondary)" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        layout
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((mod) => {
            const Icon = CATEGORY_ICONS[mod.category] ?? FileText;
            return (
              <motion.div
                key={mod.id}
                layout
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="card"
              >
                <Icon className="h-6 w-6 opacity-70" style={{ color: "var(--color-primary)" }} strokeWidth={1.5} />
                <p className="mt-3 text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>{mod.name}</p>
                <p className="mt-2 text-body" style={{ color: "var(--color-ink-secondary)", lineHeight: 1.6 }}>{mod.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2.5 py-1 text-caption font-medium" style={{ background: "var(--color-ground-section)", color: "var(--color-ink-secondary)" }}>
                    {planLabel(mod.id)}
                  </span>
                  {!isModuleIncludedInPlan(mod.id, "enterprise") && (
                    <span className="text-caption" style={{ color: "var(--color-ink-tertiary)" }}>
                      +${mod.addOnPricePerMonth}/mo add-on
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
