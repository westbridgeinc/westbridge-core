"use client";

import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="dashboard-theme min-h-screen" style={{ background: "var(--color-ground)" }}>
      <DashboardSidebar />
      <main
        className="min-h-screen p-8 transition-[margin-left] duration-200 ease-in-out"
        style={{ marginLeft: collapsed ? 64 : 240, background: "var(--color-ground)" }}
      >
        <DashboardTopbar />
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}
