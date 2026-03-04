"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calculator,
  Receipt,
  Users,
  FileBarChart,
  Package,
  Truck,
  UserCog,
  DollarSign,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { SITE } from "@/lib/config/site";
import { useSidebar } from "@/components/dashboard/SidebarContext";
import { Tooltip } from "@/components/ui/Tooltip";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { label: "Accounting", href: "/dashboard/accounting", icon: Calculator },
  { label: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { label: "CRM", href: "/dashboard/crm", icon: Users },
  { label: "Quotations", href: "/dashboard/quotations", icon: FileBarChart },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package },
  { label: "Procurement", href: "/dashboard/procurement", icon: Truck },
  { label: "HR", href: "/dashboard/hr", icon: UserCog },
  { label: "Payroll", href: "/dashboard/payroll", icon: DollarSign },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const sections = [
  { title: "OVERVIEW", items: [nav[0]] },
  { title: "FINANCE", items: nav.slice(1, 4) },
  { title: "SALES", items: nav.slice(4, 6) },
  { title: "OPERATIONS", items: nav.slice(6, 8) },
  { title: "PEOPLE", items: nav.slice(8, 10) },
  { title: "REPORTS", items: nav.slice(10, 11) },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className="fixed left-0 top-0 z-10 h-screen border-r transition-[width] duration-200 ease-in-out"
      style={{
        width: collapsed ? 64 : 240,
        borderColor: "var(--color-border)",
        background: "var(--color-ground)",
      }}
    >
      <div className="flex h-full flex-col p-4">
        <Link href="/dashboard" className="flex items-center gap-2 py-1">
          {collapsed ? (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ background: "var(--color-primary)" }}
            >
              W
            </div>
          ) : (
            <Image
              src={SITE.logoPath}
              alt={SITE.name}
              width={120}
              height={36}
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          )}
        </Link>
        <div className="my-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }} />
        <nav className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden">
          {sections.map((sec) => (
            <div key={sec.title}>
              {!collapsed && (
                <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>
                  {sec.title}
                </p>
              )}
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  const linkEl = (
                    <Link
                      href={item.href}
                      className="relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] transition-colors duration-150"
                      style={{
                        color: isActive ? "var(--color-accent)" : "var(--color-ink-secondary)",
                        background: isActive ? "var(--color-ground-section)" : "transparent",
                        justifyContent: collapsed ? "center" : "flex-start",
                      }}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                          style={{ background: "var(--color-accent)" }}
                        />
                      )}
                      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} style={{ opacity: isActive ? 1 : 0.7 }} />
                      {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  );
                  return collapsed ? (
                    <Tooltip key={item.href} content={item.label} side="right">
                      {linkEl}
                    </Tooltip>
                  ) : (
                    <div key={item.href}>{linkEl}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t pt-3" style={{ borderColor: "var(--color-border-subtle)" }}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Tooltip content="Settings" side="right">
                <Link
                  href="/dashboard/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-ground-section)]"
                >
                  <Settings className="h-5 w-5" style={{ color: "var(--color-ink-secondary)" }} />
                </Link>
              </Tooltip>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ background: "linear-gradient(135deg, hsl(222, 47%, 35%), hsl(222, 47%, 25%))" }}
              >
                A
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, hsl(222, 47%, 35%), hsl(222, 47%, 25%))" }}
                >
                  A
                </div>
                <span className="text-[0.9375rem] font-medium" style={{ color: "var(--color-ink)" }}>Admin</span>
              </div>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 text-[0.9375rem] font-medium transition-opacity hover:opacity-100"
                style={{ color: "var(--color-ink-secondary)" }}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={toggle}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-colors hover:bg-[var(--color-ground-section)]"
            style={{ color: "var(--color-ink-tertiary)" }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
