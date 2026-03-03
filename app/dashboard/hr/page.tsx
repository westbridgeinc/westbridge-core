const STATS = [
  { label: "Total", value: "47" },
  { label: "Active", value: "44" },
  { label: "On Leave", value: "3" },
];

const EMPLOYEES = [
  { name: "Priya Ramdeen", department: "Finance", position: "Accountant", status: "Active", joined: "Jan 2024" },
  { name: "Devendra Singh", department: "Operations", position: "Operations Manager", status: "Active", joined: "Mar 2024" },
  { name: "Shantelle Williams", department: "HR", position: "HR Manager", status: "Active", joined: "May 2024" },
  { name: "Rajiv Persaud", department: "Sales", position: "Sales Lead", status: "Active", joined: "Jun 2024" },
  { name: "Camille Thomas", department: "Finance", position: "Payroll Officer", status: "Active", joined: "Aug 2024" },
  { name: "Akash Doobay", department: "IT", position: "Systems Admin", status: "Active", joined: "Sep 2024" },
  { name: "Natasha Charles", department: "Sales", position: "Account Executive", status: "On Leave", joined: "Oct 2024" },
  { name: "Marcus Fernandes", department: "Operations", position: "Warehouse Supervisor", status: "Active", joined: "Nov 2024" },
];

export default function HRPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">HR</h1>
      <p className="text-sm text-gray-500">Employee directory and management</p>

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
              <th className="py-3 pl-6 text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Department</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Position</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="py-3 pr-6 pl-4 text-xs font-medium uppercase tracking-wider text-gray-500">Joined</th>
            </tr>
          </thead>
          <tbody>
            {EMPLOYEES.map((e, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 pl-6 font-medium text-black">{e.name}</td>
                <td className="py-3 px-4 text-gray-600">{e.department}</td>
                <td className="py-3 px-4 text-gray-600">{e.position}</td>
                <td className="py-3 px-4">
                  <span className={e.status === "Active" ? "text-green-600" : "text-yellow-600"}>
                    {e.status}
                  </span>
                </td>
                <td className="py-3 pr-6 pl-4 text-gray-600">{e.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
