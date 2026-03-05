"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Download, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { useToasts } from "@/components/ui/Toasts";
import {
  PLANS,
  MODULES,
  CATEGORIES,
  getPlan,
  isModuleIncludedInPlan,
  type PlanId,
} from "@/lib/modules";

const TAB_ITEMS = [
  { id: "general", label: "General" },
  { id: "billing", label: "Billing" },
  { id: "team", label: "Team" },
  { id: "modules", label: "Modules" },
  { id: "api", label: "API" },
  { id: "notifications", label: "Notifications" },
];
const TAB_IDS = TAB_ITEMS.map((t) => t.id);

const INITIAL_GENERAL = {
  company: "Acme Industries Inc.",
  email: "admin@acme.gy",
  country: "Guyana",
  currency: "GYD",
  timezone: "America/Guyana",
};

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const initialTab = tabFromUrl && TAB_IDS.includes(tabFromUrl) ? tabFromUrl : "general";
  const [tab, setTab] = useState(initialTab);
  const [company, setCompany] = useState(INITIAL_GENERAL.company);
  const [email, setEmail] = useState(INITIAL_GENERAL.email);
  const [country, setCountry] = useState(INITIAL_GENERAL.country);
  const [currency, setCurrency] = useState(INITIAL_GENERAL.currency);
  const [timezone, setTimezone] = useState(INITIAL_GENERAL.timezone);
  const [saving, setSaving] = useState(false);
  const initialRef = useRef(INITIAL_GENERAL);
  const { addToast } = useToasts();

  const [emailNotif, setEmailNotif] = useState(true);
  const [invoiceReminders, setInvoiceReminders] = useState(true);
  const [payrollAlerts, setPayrollAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [crmDealUpdates, setCrmDealUpdates] = useState(false);

  const handleNotifToggle = useCallback(
    (setter: (v: boolean) => void, value: boolean) => {
      setter(value);
      addToast("Preferences saved", "success");
    },
    [addToast]
  );

  const currentPlanId: PlanId = "professional";
  const currentPlan = getPlan(currentPlanId);
  const usageUsers = 5;
  const usageUsersMax = currentPlan.maxUsers === -1 ? 100 : currentPlan.maxUsers;
  const usageStorageGb = 2.1;
  const usageStorageMax = currentPlan.storageGB === -1 ? 100 : currentPlan.storageGB;

  const billingHistory = [
    { id: "inv-1", date: "2025-02-01", amount: "USD 295", status: "Paid", pdf: "#" },
    { id: "inv-2", date: "2025-01-01", amount: "USD 295", status: "Paid", pdf: "#" },
    { id: "inv-3", date: "2024-12-01", amount: "USD 295", status: "Paid", pdf: "#" },
  ];

  const teamMembers = [
    { id: "u1", name: "You", email: "admin@acme.gy", role: "Owner", status: "Active", lastActive: "Just now", isYou: true },
    { id: "u2", name: "Priya Ramdeen", email: "priya@acme.gy", role: "Member", status: "Active", lastActive: "2 hours ago", isYou: false },
  ];
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [moduleActivateConfirm, setModuleActivateConfirm] = useState<{ name: string; id: string; price: number } | null>(null);
  const [activeAddOnIds, setActiveAddOnIds] = useState<Set<string>>(new Set());
  const isModuleActive = useCallback((moduleId: string) => currentPlan.includedModuleIds.includes(moduleId) || activeAddOnIds.has(moduleId), [currentPlan.includedModuleIds, activeAddOnIds]);
  const [apiKeys, setApiKeys] = useState([
    { id: "key-1", prefix: "wb_live_••••••••abc1", label: "Production", created: "2025-01-15", lastUsed: "Today", status: "Active" },
  ]);
  const [apiKeyModal, setApiKeyModal] = useState<{ open: boolean; label: string; generatedKey: string | null }>({ open: false, label: "", generatedKey: null });
  const webhookUrl = "https://api.westbridge.gy/webhooks/your-account-id";

  const handleSendInvite = useCallback(() => {
    if (!inviteEmail.trim()) return;
    addToast(`Invitation sent to ${inviteEmail}`, "success");
    setInviteEmail("");
    setInviteRole("Member");
  }, [inviteEmail, addToast]);

  const handleActivateModule = useCallback(() => {
    if (moduleActivateConfirm) {
      setActiveAddOnIds((s) => new Set(s).add(moduleActivateConfirm.id));
      addToast(`${moduleActivateConfirm.name} activated`, "success");
      setModuleActivateConfirm(null);
    }
  }, [moduleActivateConfirm, addToast]);

  const handleGenerateKey = useCallback(() => {
    const key = "wb_live_" + Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 10);
    setApiKeyModal((p) => ({ ...p, generatedKey: key }));
  }, []);

  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      addToast(`${label} copied to clipboard`, "success");
    },
    [addToast]
  );

  useEffect(() => {
    if (tabFromUrl && TAB_IDS.includes(tabFromUrl)) setTab(tabFromUrl);
  }, [tabFromUrl]);

  const currentGeneral = { company, email, country, currency, timezone };
  const dirty =
    company !== initialRef.current.company ||
    email !== initialRef.current.email ||
    country !== initialRef.current.country ||
    currency !== initialRef.current.currency ||
    timezone !== initialRef.current.timezone;

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!dirty) return;
      const previous = { ...initialRef.current };
      initialRef.current = { ...currentGeneral };
      addToast("Settings saved successfully", "success");
      setSaving(true);
      try {
        await new Promise((r) => setTimeout(r, 600));
      } catch {
        initialRef.current = previous;
        addToast("Failed to save settings", "error");
      } finally {
        setSaving(false);
      }
    },
    [dirty, currentGeneral, addToast]
  );

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="mt-8">
        <Tabs items={TAB_ITEMS} activeId={tab} onChange={setTab} />
      </div>

      <div
        className="mt-6 rounded-[var(--radius-md)] border p-6"
        style={{ borderColor: "var(--color-border)", background: "var(--color-ground-elevated)" }}
      >
        {tab === "general" && (
          <form className="max-w-lg space-y-5" onSubmit={handleSave}>
            <Input label="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Select
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={[
                { value: "Guyana", label: "Guyana" },
                { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
                { value: "Jamaica", label: "Jamaica" },
                { value: "Barbados", label: "Barbados" },
                { value: "Suriname", label: "Suriname" },
                { value: "United States", label: "United States" },
              ]}
            />
            <Select
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: "GYD", label: "GYD — Guyanese Dollar" },
                { value: "USD", label: "USD — US Dollar" },
                { value: "TTD", label: "TTD — Trinidad Dollar" },
                { value: "BBD", label: "BBD — Barbados Dollar" },
                { value: "JMD", label: "JMD — Jamaican Dollar" },
              ]}
            />
            <Select
              label="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: "America/Guyana", label: "America/Guyana (UTC-4)" },
                { value: "America/Port_of_Spain", label: "America/Port_of_Spain (UTC-4)" },
                { value: "America/Jamaica", label: "America/Jamaica (UTC-5)" },
                { value: "America/New_York", label: "America/New_York (UTC-5)" },
              ]}
            />
            <div className="pt-2">
              <Button variant="primary" size="md" type="submit" loading={saving} disabled={!dirty}>
                Save changes
              </Button>
            </div>
          </form>
        )}
        {tab === "notifications" && (
          <div className="max-w-lg space-y-6">
            <p className="text-body" style={{ color: "var(--color-ink-secondary)" }}>
              Choose which notifications you want to receive. Changes are saved automatically.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-lg border py-3 px-4" style={{ borderColor: "var(--color-border)" }}>
                <label className="text-body font-medium" style={{ color: "var(--color-ink)" }} htmlFor="notif-email">
                  Email notifications
                </label>
                <Switch
                  id="notif-email"
                  checked={emailNotif}
                  onChange={(v) => handleNotifToggle(setEmailNotif, v)}
                  aria-label="Email notifications"
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border py-3 px-4" style={{ borderColor: "var(--color-border)" }}>
                <label className="text-body font-medium" style={{ color: "var(--color-ink)" }} htmlFor="notif-invoice">
                  Invoice reminders
                </label>
                <Switch
                  id="notif-invoice"
                  checked={invoiceReminders}
                  onChange={(v) => handleNotifToggle(setInvoiceReminders, v)}
                  aria-label="Invoice reminders"
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border py-3 px-4" style={{ borderColor: "var(--color-border)" }}>
                <label className="text-body font-medium" style={{ color: "var(--color-ink)" }} htmlFor="notif-payroll">
                  Payroll alerts
                </label>
                <Switch
                  id="notif-payroll"
                  checked={payrollAlerts}
                  onChange={(v) => handleNotifToggle(setPayrollAlerts, v)}
                  aria-label="Payroll alerts"
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border py-3 px-4" style={{ borderColor: "var(--color-border)" }}>
                <label className="text-body font-medium" style={{ color: "var(--color-ink)" }} htmlFor="notif-stock">
                  Low stock alerts
                </label>
                <Switch
                  id="notif-stock"
                  checked={lowStockAlerts}
                  onChange={(v) => handleNotifToggle(setLowStockAlerts, v)}
                  aria-label="Low stock alerts"
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border py-3 px-4" style={{ borderColor: "var(--color-border)" }}>
                <label className="text-body font-medium" style={{ color: "var(--color-ink)" }} htmlFor="notif-crm">
                  CRM deal updates
                </label>
                <Switch
                  id="notif-crm"
                  checked={crmDealUpdates}
                  onChange={(v) => handleNotifToggle(setCrmDealUpdates, v)}
                  aria-label="CRM deal updates"
                />
              </div>
            </div>
          </div>
        )}
        {tab === "billing" && (
          <div className="space-y-8">
            <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-body font-semibold" style={{ color: "var(--color-ink)" }}>Current plan</p>
              <p className="mt-1 text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>{currentPlan.name}</p>
              <p className="mt-1 text-caption" style={{ color: "var(--color-ink-tertiary)" }}>
                ${currentPlan.pricePerUserPerMonth}/user/mo · Billed monthly · Next renewal Mar 1, 2026
              </p>
            </div>
            <div>
              <p className="text-body font-semibold" style={{ color: "var(--color-ink)" }}>Usage</p>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--color-ink-secondary)" }}>Users</span>
                    <span style={{ color: "var(--color-ink)" }}>{usageUsers} of {usageUsersMax}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--color-ground-muted)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(usageUsers / usageUsersMax) * 100}%`, background: "var(--color-accent)" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--color-ink-secondary)" }}>Storage</span>
                    <span style={{ color: "var(--color-ink)" }}>{usageStorageGb} GB of {usageStorageMax} GB</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--color-ground-muted)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(usageStorageGb / usageStorageMax) * 100}%`, background: "var(--color-accent)" }} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-body font-semibold" style={{ color: "var(--color-ink)" }}>Payment method</p>
              <p className="mt-1 text-body" style={{ color: "var(--color-ink-secondary)" }}>•••• •••• •••• 4242</p>
              <Button variant="secondary" size="md" className="mt-2" onClick={() => addToast("Payment updates are handled via 2Checkout", "info", { action: { label: "Open 2Checkout", onClick: () => window.open("https://2checkout.com", "_blank") } })}>
                Update
              </Button>
            </div>
            <div>
              <p className="text-body font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Billing history</p>
              <div className="overflow-hidden rounded-[var(--radius-md)] border" style={{ borderColor: "var(--color-border)" }}>
                <table className="w-full text-[0.9375rem]">
                  <thead>
                    <tr style={{ borderColor: "var(--color-border)", background: "var(--color-ground-muted)" }}>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>Date</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>Amount</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>Status</th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((row) => (
                      <tr key={row.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                        <td className="px-4 py-3" style={{ color: "var(--color-ink)" }}>{row.date}</td>
                        <td className="px-4 py-3" style={{ color: "var(--color-ink)" }}>{row.amount}</td>
                        <td className="px-4 py-3"><Badge status={row.status}>{row.status}</Badge></td>
                        <td className="px-4 py-3 text-right">
                          <a href={row.pdf} className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--color-accent)" }}><Download className="h-4 w-4" /> PDF</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {(currentPlanId === "starter" || currentPlanId === "professional") && (
              <div className="rounded-lg border py-4 px-4" style={{ borderColor: "var(--color-accent)", background: "rgb(20 184 166 / 0.06)" }}>
                <p className="text-body font-medium" style={{ color: "var(--color-ink)" }}>Upgrade to unlock all 38 modules</p>
                <p className="mt-0.5 text-caption" style={{ color: "var(--color-ink-tertiary)" }}>Enterprise includes unlimited users, storage, and every module.</p>
                <Button variant="primary" size="md" className="mt-3">View plans</Button>
              </div>
            )}
          </div>
        )}
        {tab === "team" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Input label="Email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="flex-1" />
              <Select label="Role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} options={[{ value: "Owner", label: "Owner" }, { value: "Admin", label: "Admin" }, { value: "Member", label: "Member" }]} className="w-40" />
              <Button variant="primary" size="md" onClick={handleSendInvite} disabled={!inviteEmail.trim()}>Send Invite</Button>
            </div>
            <DataTable
              columns={[
                { id: "name", header: "Name", accessor: (r) => <span className="font-medium" style={{ color: "var(--color-ink)" }}>{r.name}{r.isYou && <span className="ml-2 text-xs font-normal" style={{ color: "var(--color-ink-tertiary)" }}>(You)</span>}</span>, sortValue: (r) => r.name },
                { id: "email", header: "Email", accessor: (r) => <span style={{ color: "var(--color-ink-secondary)" }}>{r.email}</span>, sortValue: (r) => r.email },
                { id: "role", header: "Role", accessor: (r) => r.role, sortValue: (r) => r.role },
                { id: "status", header: "Status", accessor: (r) => <Badge status={r.status}>{r.status}</Badge>, sortValue: (r) => r.status },
                { id: "lastActive", header: "Last Active", accessor: (r) => <span style={{ color: "var(--color-ink-tertiary)" }}>{r.lastActive}</span>, sortValue: (r) => r.lastActive },
              ]}
              data={teamMembers}
              keyExtractor={(r) => r.id}
              pageSize={10}
            />
          </div>
        )}
        {tab === "modules" && (
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const items = MODULES.filter((m) => m.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>{cat}</p>
                  <div className="space-y-2">
                    {items.map((m) => {
                      const included = isModuleIncludedInPlan(m.id, currentPlanId);
                      const isActive = isModuleActive(m.id);
                      return (
                        <div
                          key={m.id}
                          className="flex items-center justify-between gap-4 rounded-lg border py-3 px-4"
                          style={{ borderColor: "var(--color-border)", background: isActive ? undefined : "var(--color-ground-muted)", opacity: isActive ? 1 : 0.85 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: isActive ? "var(--color-accent)" : "var(--color-ink-tertiary)" }} />
                            <span className="text-body font-medium" style={{ color: "var(--color-ink)" }}>{m.name}</span>
                            {!included && m.addOnPricePerMonth > 0 && (
                              <span className="text-caption" style={{ color: "var(--color-ink-tertiary)" }}>+${m.addOnPricePerMonth}/mo</span>
                            )}
                          </div>
                          {included ? (
                            <span className="text-caption" style={{ color: "var(--color-ink-tertiary)" }}>Included</span>
                          ) : isActive ? (
                            <span className="text-caption" style={{ color: "var(--color-success)" }}>Active</span>
                          ) : (
                            <Button variant="secondary" size="sm" onClick={() => setModuleActivateConfirm({ name: m.name, id: m.id, price: m.addOnPricePerMonth })}>Activate</Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <p className="text-caption pt-2" style={{ color: "var(--color-ink-tertiary)" }}>
              Your plan includes {currentPlan.includedModuleIds.length} modules.
              {activeAddOnIds.size > 0 && (
                <> {activeAddOnIds.size} add-on{activeAddOnIds.size !== 1 ? "s" : ""} active (${Array.from(activeAddOnIds).reduce((sum, id) => sum + (MODULES.find((m) => m.id === id)?.addOnPricePerMonth ?? 0), 0)}/mo).</>
              )}
            </p>
          </div>
        )}
        {tab === "api" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-body font-semibold" style={{ color: "var(--color-ink)" }}>API Keys</p>
                <Button variant="primary" size="md" onClick={() => setApiKeyModal({ open: true, label: "", generatedKey: null })}>Generate new key</Button>
              </div>
              <div className="mt-4 overflow-hidden rounded-[var(--radius-md)] border" style={{ borderColor: "var(--color-border)" }}>
                <table className="w-full text-[0.9375rem]">
                  <thead>
                    <tr style={{ borderColor: "var(--color-border)", background: "var(--color-ground-muted)" }}>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>Prefix</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>Label</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>Created</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>Last used</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((row) => (
                      <tr key={row.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                        <td className="px-4 py-3 font-mono text-sm" style={{ color: "var(--color-ink)" }}>{row.prefix}</td>
                        <td className="px-4 py-3" style={{ color: "var(--color-ink)" }}>{row.label}</td>
                        <td className="px-4 py-3" style={{ color: "var(--color-ink-secondary)" }}>{row.created}</td>
                        <td className="px-4 py-3" style={{ color: "var(--color-ink-secondary)" }}>{row.lastUsed}</td>
                        <td className="px-4 py-3"><Badge status={row.status}>{row.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p className="text-body font-semibold" style={{ color: "var(--color-ink)" }}>API documentation</p>
              <a href="#" className="mt-1 inline-flex items-center gap-1 text-body" style={{ color: "var(--color-accent)" }}>API documentation coming soon <ExternalLink className="h-4 w-4" /></a>
            </div>
            <div>
              <p className="text-body font-semibold" style={{ color: "var(--color-ink)" }}>Webhook URL</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-ground-muted)", color: "var(--color-ink)" }}>{webhookUrl}</code>
                <Button variant="secondary" size="md" onClick={() => copyToClipboard(webhookUrl, "Webhook URL")} leftIcon={<Copy className="h-4 w-4" />}>Copy</Button>
              </div>
            </div>
          </div>
        )}
        {tab !== "general" && tab !== "notifications" && tab !== "billing" && tab !== "team" && tab !== "modules" && tab !== "api" && (
          <div className="flex flex-col items-center py-12">
            <p className="text-h3 font-semibold" style={{ color: "var(--color-ink)" }}>
              {TAB_ITEMS.find((t) => t.id === tab)?.label}
            </p>
            <p className="mt-2" style={{ color: "var(--color-ink-tertiary)", fontSize: "var(--font-body)" }}>
              This section is coming soon.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!moduleActivateConfirm}
        onClose={() => setModuleActivateConfirm(null)}
        onConfirm={handleActivateModule}
        title="Activate module?"
        description={moduleActivateConfirm ? `Activate ${moduleActivateConfirm.name}? This will add $${moduleActivateConfirm.price}/mo to your billing.` : ""}
        confirmLabel="Activate"
        cancelLabel="Cancel"
      />

      <Modal
        open={apiKeyModal.open}
        onClose={() => setApiKeyModal({ open: false, label: "", generatedKey: null })}
        title={apiKeyModal.generatedKey ? "API key created" : "Generate new key"}
      >
        <div className="space-y-4">
          {!apiKeyModal.generatedKey ? (
            <>
              <Input label="Label" value={apiKeyModal.label} onChange={(e) => setApiKeyModal((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. Production" />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="md" onClick={() => setApiKeyModal({ open: false, label: "", generatedKey: null })}>Cancel</Button>
                <Button variant="primary" size="md" onClick={handleGenerateKey}>Generate</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-caption" style={{ color: "var(--color-ink-secondary)" }}>Copy this key now. It won&apos;t be shown again.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg border px-3 py-2 text-sm font-mono break-all" style={{ borderColor: "var(--color-border)", background: "var(--color-ground-muted)", color: "var(--color-ink)" }}>{apiKeyModal.generatedKey}</code>
                <Button variant="secondary" size="md" onClick={() => copyToClipboard(apiKeyModal.generatedKey!, "API key")} leftIcon={<Copy className="h-4 w-4" />}>Copy</Button>
              </div>
              <Button variant="primary" size="md" className="w-full" onClick={() => setApiKeyModal({ open: false, label: "", generatedKey: null })}>Done</Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
