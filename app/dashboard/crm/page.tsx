"use client";

const COLUMNS = [
  {
    id: "lead",
    title: "Lead",
    count: 4,
    total: "GYD 2.8M",
    deals: [
      { company: "Demerara Distillers", value: "GYD 800K", contact: "R. Singh", date: "28 Feb" },
      { company: "Banks DIH Ltd", value: "GYD 1.2M", contact: "M. Persaud", date: "27 Feb" },
      { company: "Guyana Sugar Corp", value: "GYD 500K", contact: "A. Charles", date: "26 Feb" },
      { company: "Berbice Shipping", value: "GYD 300K", contact: "K. Williams", date: "25 Feb" },
    ],
  },
  {
    id: "qualified",
    title: "Qualified",
    count: 3,
    total: "GYD 4.2M",
    deals: [
      { company: "Stabroek Holdings", value: "GYD 2.1M", contact: "D. Fernandes", date: "24 Feb" },
      { company: "Ogle Energy", value: "GYD 1.5M", contact: "S. Doobay", date: "23 Feb" },
      { company: "Mahaica Farms", value: "GYD 600K", contact: "P. Ramdeen", date: "22 Feb" },
    ],
  },
  {
    id: "proposal",
    title: "Proposal",
    count: 2,
    total: "GYD 3.1M",
    deals: [
      { company: "E-Networks Inc", value: "GYD 1.8M", contact: "T. Thomas", date: "21 Feb" },
      { company: "GT&T Telecom", value: "GYD 1.3M", contact: "N. Charles", date: "20 Feb" },
    ],
  },
  {
    id: "won",
    title: "Won",
    count: 5,
    total: "GYD 8.9M",
    deals: [
      { company: "Republic Bank GY", value: "GYD 3.2M", contact: "J. Persaud", date: "19 Feb" },
      { company: "Guyoil", value: "GYD 2.1M", contact: "R. Singh", date: "18 Feb" },
      { company: "GBTI", value: "GYD 1.5M", contact: "M. Fernandes", date: "17 Feb" },
      { company: "Beharry Group", value: "GYD 1.2M", contact: "A. Doobay", date: "16 Feb" },
      { company: "Nand Persaud & Co", value: "GYD 900K", contact: "C. Thomas", date: "15 Feb" },
    ],
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CRMPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">CRM Pipeline</h1>
        <button className="rounded-md bg-black px-4 py-2.5 text-sm text-white hover:bg-gray-800 transition">
          Add Deal
        </button>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="min-w-[280px] flex-1 rounded-xl bg-gray-50 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-black">{col.title}</h2>
              <span className="text-xs text-gray-500">
                {col.count} deals · {col.total}
              </span>
            </div>
            <div className="space-y-3">
              {col.deals.map((deal) => (
                <div
                  key={deal.company}
                  className="cursor-pointer rounded-lg border border-gray-100 bg-white p-4 transition hover:border-gray-200"
                >
                  <p className="font-medium text-black">{deal.company}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{deal.value}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{deal.contact}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
                        {initials(deal.contact)}
                      </span>
                      <span className="text-xs text-gray-400">{deal.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
