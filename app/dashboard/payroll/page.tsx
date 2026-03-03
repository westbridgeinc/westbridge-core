const STATS = [
  { label: "Monthly payroll", value: "GYD 4.8M" },
  { label: "Employees", value: "47" },
  { label: "Next run", value: "Mar 1" },
];

const ROWS = [
  { employee: "Priya Ramdeen", base: "285,000", nis: "39,900", tax: "42,750", net: "202,350", status: "Processed" },
  { employee: "Devendra Singh", base: "320,000", nis: "44,800", tax: "48,000", net: "227,200", status: "Processed" },
  { employee: "Shantelle Williams", base: "310,000", nis: "43,400", tax: "46,500", net: "220,100", status: "Processed" },
  { employee: "Rajiv Persaud", base: "295,000", nis: "41,300", tax: "44,250", net: "209,450", status: "Processed" },
  { employee: "Camille Thomas", base: "268,000", nis: "37,520", tax: "40,200", net: "190,280", status: "Pending" },
  { employee: "Akash Doobay", base: "275,000", nis: "38,500", tax: "41,250", net: "195,250", status: "Processed" },
];

export default function PayrollPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">Payroll</h1>
      <p className="text-sm text-gray-500">NIS/GYD payroll and salary slips</p>

      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
        February payroll due in 3 days
      </div>

      <div className="mt-6 flex gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white px-6 py-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-xl font-semibold text-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="py-3 pl-6 text-xs font-medium uppercase tracking-wider text-gray-500">Employee</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Base Salary</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">NIS (14%)</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Income Tax</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Net Pay</th>
              <th className="py-3 pr-6 pl-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 pl-6 font-medium text-black">{r.employee}</td>
                <td className="py-3 px-4 text-right text-gray-900">GYD {r.base}</td>
                <td className="py-3 px-4 text-right text-gray-600">GYD {r.nis}</td>
                <td className="py-3 px-4 text-right text-gray-600">GYD {r.tax}</td>
                <td className="py-3 px-4 text-right font-medium text-black">GYD {r.net}</td>
                <td className="py-3 pr-6 pl-4">
                  <span className={r.status === "Processed" ? "text-green-600" : "text-yellow-600"}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
