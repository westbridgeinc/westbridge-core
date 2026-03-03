import Link from "next/link";
import { MODULES } from "@/lib/module-catalog";

const HOMEPAGE_MODULE_IDS = ["invoicing", "crm", "inventory", "payroll", "accounting", "projects"];

export default function Home() {
  const homepageModules = HOMEPAGE_MODULE_IDS.map((id) => MODULES.find((m) => m.id === id)!);
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight text-black">
            Westbridge
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-black">
              Pricing
            </Link>
            <Link href="/modules" className="text-sm text-gray-600 hover:text-black">
              Modules
            </Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-black">
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-black">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
            Enterprise software for the Caribbean
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.08] tracking-tight text-black md:text-7xl">
            Run your entire business from one platform.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-500">
            Invoicing, inventory, HR, payroll, CRM — with AI built in. Designed for Caribbean businesses from day one.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              Start free trial
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              See pricing →
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Free 14-day trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* Modules Section */}
      <section className="border-t border-gray-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
            Platform
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            38 modules. One subscription.
          </h2>
          <p className="mt-2 text-gray-500">
            Pick the modules you need. Add more as you grow.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {homepageModules.map((m) => (
              <div key={m.id} className="rounded-xl bg-gray-50 p-6 transition hover:bg-gray-100">
                <p className="text-sm font-semibold text-black">{m.name}</p>
                <p className="mt-1 text-sm text-gray-500">{m.description}</p>
                <p className="mt-3 text-xs text-gray-400">${m.pricePerMonth}/mo (market)</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caribbean Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Built for the Caribbean, not retrofitted
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 border border-gray-100">
              <p className="text-base font-semibold text-black">GYD & Caribbean currencies</p>
              <p className="mt-2 text-sm text-gray-500">Native multi-currency support for GYD, USD, and regional currencies.</p>
            </div>
            <div className="rounded-xl bg-white p-6 border border-gray-100">
              <p className="text-base font-semibold text-black">VAT & NIS compliance</p>
              <p className="mt-2 text-sm text-gray-500">14% VAT, NIS deductions, and local tax rules built in.</p>
            </div>
            <div className="rounded-xl bg-white p-6 border border-gray-100">
              <p className="text-base font-semibold text-black">WhatsApp native</p>
              <p className="mt-2 text-sm text-gray-500">Business notifications and updates via WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-24 text-center text-white">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to modernize your business?
        </h2>
        <p className="mt-2 text-gray-400">
          Start your 14-day free trial. No credit card required.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-100 transition"
        >
          Start free trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="text-sm text-gray-500">© 2026 Westbridge</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/modules" className="hover:text-white transition">Modules</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
