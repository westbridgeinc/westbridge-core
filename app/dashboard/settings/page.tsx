"use client";

import { useState } from "react";

const TABS = ["General", "Billing", "Team", "Modules", "API", "Notifications"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">Settings</h1>
      <p className="text-sm text-gray-500">Manage your account and preferences</p>

      <div className="mt-8 flex gap-8">
        <div className="w-48 shrink-0">
          <nav className="flex flex-col gap-0.5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-2 text-left text-sm ${
                  activeTab === tab
                    ? "bg-gray-100 font-medium text-black"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-white p-6">
          {activeTab === "General" && (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company name</label>
                <input
                  type="text"
                  defaultValue="Georgetown Hardware Ltd"
                  className="mt-1 w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <select className="mt-1 w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black">
                  <option>Guyana</option>
                  <option>Trinidad and Tobago</option>
                  <option>Jamaica</option>
                  <option>Barbados</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <input
                  type="text"
                  defaultValue="GYD"
                  className="mt-1 w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select className="mt-1 w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black">
                  <option>America/Guyana</option>
                  <option>America/Port_of_Spain</option>
                  <option>America/Jamaica</option>
                </select>
              </div>
              <button
                type="button"
                className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Save changes
              </button>
            </form>
          )}
          {activeTab !== "General" && (
            <p className="text-sm text-gray-500">This section is not yet configured.</p>
          )}
        </div>
      </div>
    </div>
  );
}
