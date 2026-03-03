"use client";

import { useState, useMemo } from "react";

const INVOICES = [
  { id: "INV-001", customer: "Georgetown Hardware Ltd", amount: 245000, status: "Paid", date: "15 Feb 2026", dueDate: "15 Mar 2026" },
  { id: "INV-002", customer: "Demerara Shipping Co", amount: 1200000, status: "Overdue", date: "01 Feb 2026", dueDate: "01 Mar 2026" },
  { id: "INV-003", customer: "Stabroek Market Foods", amount: 89000, status: "Unpaid", date: "20 Feb 2026", dueDate: "20 Mar 2026" },
  { id: "INV-004", customer: "BerbiceTech Solutions", amount: 450000, status: "Draft", date: "25 Feb 2026", dueDate: "—" },
  { id: "INV-005", customer: "Essequibo Farms Inc", amount: 178000, status: "Paid", date: "10 Feb 2026", dueDate: "10 Mar 2026" },
  { id: "INV-006", customer: "New Amsterdam Builders", amount: 2100000, status: "Unpaid", date: "18 Feb 2026", dueDate: "18 Mar 2026" },
  { id: "INV-007", customer: "Linden Mining Corp", amount: 890000, status: "Paid", date: "05 Feb 2026", dueDate: "05 Mar 2026" },
  { id: "INV-008", customer: "Bartica Gold Trading", amount: 3400000, status: "Overdue", date: "28 Jan 2026", dueDate: "28 Feb 2026" },
];

const FILTERS = ["All", "Draft", "Unpaid", "Paid", "Overdue"];

function formatAmount(n: number) {
  return "GYD " + n.toLocaleString();
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-green-50 text-green-700",
    Unpaid: "bg-yellow-50 text-yellow-700",
    Overdue: "bg-red-50 text-red-700",
    Draft: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function InvoicesPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return INVOICES.filter((inv) => {
      const matchFilter = filter === "All" || inv.status === filter;
      const matchSearch =
        !search ||
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.customer.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">Invoices</h1>
        <button className="rounded-md bg-black px-4 py-2.5 text-sm text-white hover:bg-gray-800 transition">
          Create Invoice
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search invoices..."
          className="w-80 rounded-md border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="py-3 pl-6 text-xs font-medium uppercase tracking-wider text-gray-500">Invoice #</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount (GYD)</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th className="py-3 pr-6 pl-4 text-xs font-medium uppercase tracking-wider text-gray-500">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 pl-6 font-medium text-black">{inv.id}</td>
                <td className="py-3 px-4 text-gray-900">{inv.customer}</td>
                <td className="py-3 px-4 text-right font-medium text-black">{formatAmount(inv.amount)}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="py-3 px-4 text-gray-600">{inv.date}</td>
                <td className="py-3 pr-6 pl-4 text-gray-600">{inv.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>Showing 1-{filtered.length} of 24 invoices</span>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
