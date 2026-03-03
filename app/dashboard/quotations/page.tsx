const ROWS = [
  { quote: "QT-2026-001", customer: "Georgetown Hardware Ltd", amount: "1,250,000", validUntil: "15 Mar 2026", status: "Sent" },
  { quote: "QT-2026-002", customer: "Demerara Shipping Co", amount: "890,000", validUntil: "20 Mar 2026", status: "Accepted" },
  { quote: "QT-2026-003", customer: "Stabroek Market Foods", amount: "420,000", validUntil: "01 Mar 2026", status: "Expired" },
  { quote: "QT-2026-004", customer: "BerbiceTech Solutions", amount: "2,100,000", validUntil: "—", status: "Draft" },
  { quote: "QT-2026-005", customer: "New Amsterdam Builders", amount: "3,400,000", validUntil: "28 Mar 2026", status: "Sent" },
  { quote: "QT-2026-006", customer: "Linden Mining Corp", amount: "756,000", validUntil: "10 Mar 2026", status: "Draft" },
];

function Badge({ status }: { status: string }) {
  const s: Record<string, string> = {
    Sent: "bg-blue-50 text-blue-700",
    Accepted: "bg-green-50 text-green-700",
    Expired: "bg-gray-100 text-gray-600",
    Draft: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function QuotationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">Quotations</h1>
      <p className="text-sm text-gray-500">Sales quotations and proposals</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="py-3 pl-6 text-xs font-medium uppercase tracking-wider text-gray-500">Quote #</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Valid Until</th>
              <th className="py-3 pr-6 pl-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 pl-6 font-medium text-black">{r.quote}</td>
                <td className="py-3 px-4 text-gray-900">{r.customer}</td>
                <td className="py-3 px-4 text-right font-medium text-black">GYD {r.amount}</td>
                <td className="py-3 px-4 text-gray-600">{r.validUntil}</td>
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
