import { DashboardSidebar } from "./DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f0]/30">
      <DashboardSidebar />
      <main className="ml-60 min-h-screen p-8">{children}</main>
    </div>
  );
}
