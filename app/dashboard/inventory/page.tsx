const STATS = [
  { label: "Items", value: "1,247" },
  { label: "Low Stock", value: "23", highlight: "yellow" },
  { label: "Out of Stock", value: "8", highlight: "red" },
];

const ITEMS = [
  { code: "ITM-001", name: "Portland Cement", category: "Building", inStock: 450, reorderLevel: 200, value: "2,250,000", status: "In Stock" },
  { code: "ITM-002", name: "Demerara Gold Rum", category: "Beverages", inStock: 12, reorderLevel: 25, value: "480,000", status: "Low Stock" },
  { code: "ITM-003", name: "Galvanize Sheets", category: "Building", inStock: 0, reorderLevel: 50, value: "0", status: "Out of Stock" },
  { code: "ITM-004", name: "Basmati Rice", category: "Food", inStock: 320, reorderLevel: 100, value: "1,280,000", status: "In Stock" },
  { code: "ITM-005", name: "Car Battery", category: "Auto", inStock: 8, reorderLevel: 15, value: "320,000", status: "Low Stock" },
  { code: "ITM-006", name: "Printer Paper", category: "Office", inStock: 85, reorderLevel: 30, value: "85,000", status: "In Stock" },
  { code: "ITM-007", name: "Safety Helmets", category: "PPE", inStock: 0, reorderLevel: 40, value: "0", status: "Out of Stock" },
  { code: "ITM-008", name: "Diesel Fuel", category: "Fuel", inStock: 1200, reorderLevel: 500, value: "3,600,000", status: "In Stock" },
];

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">Inventory</h1>
      <p className="text-sm text-gray-500">Stock levels and reorder management</p>

      <div className="mt-6 flex gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white px-6 py-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-xl font-semibold ${s.highlight === "red" ? "text-red-600" : s.highlight === "yellow" ? "text-yellow-600" : "text-black"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="py-3 pl-6 text-xs font-medium uppercase tracking-wider text-gray-500">Item Code</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">In Stock</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Reorder Level</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Value</th>
              <th className="py-3 pr-6 pl-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 pl-6 font-medium text-black">{r.code}</td>
                <td className="py-3 px-4 text-gray-900">{r.name}</td>
                <td className="py-3 px-4 text-gray-600">{r.category}</td>
                <td className="py-3 px-4 text-right text-gray-900">{r.inStock}</td>
                <td className="py-3 px-4 text-right text-gray-600">{r.reorderLevel}</td>
                <td className="py-3 px-4 text-right font-medium text-black">GYD {r.value}</td>
                <td className="py-3 pr-6 pl-4">
                  <span className={
                    r.status === "Out of Stock" ? "text-red-600" :
                    r.status === "Low Stock" ? "text-yellow-600" : "text-green-600"
                  }>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
