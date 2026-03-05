"use client";

import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { ErpConnectionBanner } from "@/components/dashboard/ErpConnectionBanner";
import { ErpConnectionProvider } from "@/components/dashboard/ErpConnectionContext";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { ShortcutsProvider } from "@/components/dashboard/ShortcutsContext";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="dashboard-theme min-h-screen" style={{ background: "var(--color-ground)" }}>
      <DashboardSidebar />
      <main
        className={`min-h-screen p-4 transition-[margin-left] duration-200 ease-in-out md:p-8 ${collapsed ? "md:ml-16" : "md:ml-60"}`}
        style={{ background: "var(--color-ground)" }}
      >
        <DashboardTopbar />
        <ErpConnectionBanner />
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ShortcutsProvider>
        <ErpConnectionProvider>
          <DashboardShell>{children}</DashboardShell>
        </ErpConnectionProvider>
      </ShortcutsProvider>
    </SidebarProvider>
  );
}
