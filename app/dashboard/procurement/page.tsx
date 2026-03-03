const ROWS = [
  { po: "PO-2026-041", supplier: "GTTI Supplies Ltd", amount: "1,200,000", orderDate: "25 Feb 2026", expected: "10 Mar 2026", status: "Ordered" },
  { po: "PO-2026-042", supplier: "Banks DIH Ltd", amount: "890,000", orderDate: "24 Feb 2026", expected: "05 Mar 2026", status: "In Transit" },
  { po: "PO-2026-043", supplier: "Demerara Distillers", amount: "2,100,000", orderDate: "23 Feb 2026", expected: "15 Mar 2026", status: "Ordered" },
  { po: "PO-2026-044", supplier: "Nand Persaud & Co", amount: "456,000", orderDate: "22 Feb 2026", expected: "28 Feb 2026", status: "Received" },
  { po: "PO-2026-045", supplier: "Beharry Group", amount: "780,000", orderDate: "21 Feb 2026", expected: "08 Mar 2026", status: "Ordered" },
  { po: "PO-2026-046", supplier: "Republic Trading", amount: "1,050,000", orderDate: "20 Feb 2026", expected: "12 Mar 2026", status: "In Transit" },
];

export default function ProcurementPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">Procurement</h1>
      <p className="text-sm text-gray-500">Purchase orders and suppliers</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="py-3 pl-6 text-xs font-medium uppercase tracking-wider text-gray-500">PO #</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Supplier</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Order Date</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Expected Delivery</th>
              <th className="py-3 pr-6 pl-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 pl-6 font-medium text-black">{r.po}</td>
                <td className="py-3 px-4 text-gray-900">{r.supplier}</td>
                <td className="py-3 px-4 text-right font-medium text-black">GYD {r.amount}</td>
                <td className="py-3 px-4 text-gray-600">{r.orderDate}</td>
                <td className="py-3 px-4 text-gray-600">{r.expected}</td>
                <td className="py-3 pr-6 pl-4 text-gray-600">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
