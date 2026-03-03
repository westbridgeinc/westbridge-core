const STATS = [
  { label: "This month", value: "GYD 2.1M" },
  { label: "Pending", value: "47" },
  { label: "Total", value: "312" },
];

const ROWS = [
  { date: "28 Feb 2026", description: "Office supplies", category: "Administration", amount: "45,000", by: "Priya Ramdeen", status: "Approved" },
  { date: "27 Feb 2026", description: "Client dinner", category: "Travel", amount: "128,000", by: "Devendra Singh", status: "Pending" },
  { date: "26 Feb 2026", description: "Software license", category: "IT", amount: "89,000", by: "Shantelle Williams", status: "Approved" },
  { date: "25 Feb 2026", description: "Fuel", category: "Travel", amount: "32,000", by: "Rajiv Persaud", status: "Rejected" },
  { date: "24 Feb 2026", description: "Training course", category: "Professional Development", amount: "156,000", by: "Camille Thomas", status: "Pending" },
  { date: "23 Feb 2026", description: "Equipment repair", category: "Maintenance", amount: "78,000", by: "Akash Doobay", status: "Approved" },
];

function Badge({ status }: { status: string }) {
  const s: Record<string, string> = {
    Approved: "bg-green-50 text-green-700",
    Pending: "bg-yellow-50 text-yellow-700",
    Rejected: "bg-red-50 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function ExpensesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">Expenses</h1>
      <p className="text-sm text-gray-500">Expense claims and approvals</p>

      <div className="mt-6 flex gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white px-6 py-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-xl font-semibold text-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="py-3 pl-6 text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Submitted By</th>
              <th className="py-3 pr-6 pl-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 pl-6 text-gray-900">{r.date}</td>
                <td className="py-3 px-4 text-gray-900">{r.description}</td>
                <td className="py-3 px-4 text-gray-600">{r.category}</td>
                <td className="py-3 px-4 text-right font-medium text-black">GYD {r.amount}</td>
                <td className="py-3 px-4 text-gray-600">{r.by}</td>
                <td className="py-3 pr-6 pl-4">
                  <Badge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
