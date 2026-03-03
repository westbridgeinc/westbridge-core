import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight text-black">
            Westbridge
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-black">Pricing</Link>
            <Link href="/modules" className="text-sm text-gray-600 hover:text-black">Modules</Link>
            <Link href="/about" className="text-sm font-medium text-black">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-black">Sign in</Link>
            <Link href="/signup" className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 transition">Get started</Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight text-black">
          Built in Georgetown, for the Caribbean
        </h1>
        <div className="mt-8 max-w-2xl text-gray-600">
          <p className="mt-4 text-sm leading-relaxed">
            Westbridge was built to give Caribbean businesses the same enterprise tools that Fortune 500 companies use — invoicing, inventory, HR, payroll, CRM, and analytics — without the complexity or the price tag of legacy software.
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            We started in Georgetown because we saw too many businesses running on spreadsheets, siloed systems, and workarounds. Our platform is designed for GYD, VAT, NIS, and the way business is done across the region.
          </p>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <p className="text-base font-semibold text-black">Caribbean First</p>
            <p className="mt-2 text-sm text-gray-500">Built for local compliance, currencies, and workflows from day one.</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <p className="text-base font-semibold text-black">AI Native</p>
            <p className="mt-2 text-sm text-gray-500">AI assistant and automation built into the platform, not bolted on.</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <p className="text-base font-semibold text-black">Simple Pricing</p>
            <p className="mt-2 text-sm text-gray-500">Pick the modules you need. One subscription, no surprises.</p>
          </div>
        </div>

        <div className="mt-24 rounded-2xl bg-black py-16 text-center text-white">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to get started?</h2>
          <Link
            href="/signup"
            className="mt-4 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-100 transition"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </div>
  );
}
