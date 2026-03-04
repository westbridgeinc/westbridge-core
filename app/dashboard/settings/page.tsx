"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const TAB_ITEMS = [
  { id: "general", label: "General" },
  { id: "billing", label: "Billing" },
  { id: "team", label: "Team" },
  { id: "modules", label: "Modules" },
  { id: "api", label: "API" },
  { id: "notifications", label: "Notifications" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("general");
  const [company, setCompany] = useState("Acme Industries Inc.");
  const [email, setEmail] = useState("admin@acme.gy");
  const [country, setCountry] = useState("Guyana");
  const [currency, setCurrency] = useState("GYD");
  const [timezone, setTimezone] = useState("America/Guyana");

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
          <form className="max-w-lg space-y-5" onSubmit={(e) => e.preventDefault()}>
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
              <Button variant="primary" size="md" type="submit">Save changes</Button>
            </div>
          </form>
        )}
        {tab !== "general" && (
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
    </div>
  );
}
