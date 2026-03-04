import Link from "next/link";
import { ROUTES } from "@/lib/config/site";

export const metadata = {
  title: "Privacy Policy | Westbridge",
  description: "How we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-[var(--space-container)] py-16" style={{ background: "var(--color-ground)" }}>
      <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>Privacy Policy</h1>
      <p className="mt-2 text-caption" style={{ color: "var(--color-ink-tertiary)" }}>Last updated: March 2026</p>

      <div className="mt-10 space-y-8 text-body" style={{ color: "var(--color-ink-secondary)" }}>
        <section>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>1. Who we are</h2>
          <p className="mt-2 leading-relaxed">
            Westbridge provides a business management platform. This Privacy Policy describes how we collect, use, and protect your information when you use our Service.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>2. Information we collect</h2>
          <p className="mt-2 leading-relaxed">
            We collect information you provide when you sign up (e.g. name, email, company name, country), payment and billing information processed by our payment provider (2Checkout/Verifone), and usage data necessary to operate the Service (e.g. login sessions, feature usage). We do not sell your personal data.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>3. How we use it</h2>
          <p className="mt-2 leading-relaxed">
            We use your information to provide and improve the Service, process payments, communicate with you about your account, comply with legal obligations, and protect the security of the Service. We may send you service-related emails (e.g. password reset, billing); you can opt out of marketing where offered.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>4. Data location and retention</h2>
          <p className="mt-2 leading-relaxed">
            Data is stored and processed in accordance with our infrastructure and partner agreements. We retain your data for as long as your account is active or as needed to provide the Service and comply with law. You may request access, correction, or deletion of your personal data by contacting us.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>5. Security</h2>
          <p className="mt-2 leading-relaxed">
            We use industry-standard measures to protect your data, including encryption in transit and access controls. Payment data is handled by our payment provider in accordance with applicable standards.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>6. Cookies and similar technologies</h2>
          <p className="mt-2 leading-relaxed">
            We use essential cookies and similar technologies to operate the Service (e.g. session management). You can control cookie settings in your browser; disabling essential cookies may affect the Service.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>7. Changes and contact</h2>
          <p className="mt-2 leading-relaxed">
            We may update this Privacy Policy from time to time; we will post the updated version and, where appropriate, notify you. Questions or requests regarding your data may be sent to the contact details on our website.
          </p>
        </section>
      </div>

      <p className="mt-12 text-caption" style={{ color: "var(--color-ink-tertiary)" }}>
        <Link href={ROUTES.home} className="transition-colors hover:opacity-100" style={{ color: "var(--color-ink)" }}>Back to home</Link>
        {" · "}
        <Link href={ROUTES.terms} className="transition-colors hover:opacity-100" style={{ color: "var(--color-ink)" }}>Terms of Service</Link>
      </p>
    </div>
  );
}
