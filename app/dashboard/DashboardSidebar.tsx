"use client";

import Link from "next/link";
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
} from "lucide-react";

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
  return (
    <aside className="fixed left-0 top-0 z-10 h-screen w-60 border-r border-gray-100 bg-white">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-sm font-bold text-white">
            W
          </div>
          <span className="text-sm font-semibold text-black">Westbridge</span>
        </div>
        <div className="my-3 border-t border-gray-100" />
        <nav className="flex-1 space-y-6">
          {sections.map((sec) => (
            <div key={sec.title}>
              <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-gray-100 font-medium text-black"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <span className="text-sm text-black">Admin</span>
          </div>
          <Link
            href="/dashboard/settings"
            className="block px-3 py-1 text-sm text-gray-600 hover:text-black"
          >
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
