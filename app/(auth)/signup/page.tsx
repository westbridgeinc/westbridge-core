"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { MODULES as MODULE_LIST, PLANS, CATEGORIES, getPlan, isModuleIncludedInPlan } from "@/lib/modules";
import { CARIBBEAN_COUNTRIES, INDUSTRIES } from "@/lib/demo-data";
import { ROUTES, SITE } from "@/lib/config/site";
import type { PlanId } from "@/lib/modules";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stepFromUrl = Math.min(4, Math.max(1, parseInt(searchParams.get("step") ?? "1", 10) || 1));
  const [step, setStepState] = useState(stepFromUrl);
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("United States");
  const [employees, setEmployees] = useState(5);
  const [planId, setPlanId] = useState<PlanId>("professional");
  const [addOnIds, setAddOnIds] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const setStep = useCallback(
    (s: number) => {
      setStepState(s);
      const url = new URL(window.location.href);
      url.searchParams.set("step", String(s));
      router.replace(url.pathname + url.search, { scroll: false });
    },
    [router]
  );

  const returnFromPayment = searchParams.get("success") === "true";

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d: { data?: { token?: string }; token?: string }) => setCsrfToken(d.data?.token ?? d.token ?? null))
      .catch(() => setCsrfToken(null));
  }, []);

  useEffect(() => {
    if (returnFromPayment) setStep(4);
  }, [returnFromPayment, setStep]);

  useEffect(() => {
    setStepState(stepFromUrl);
  }, [stepFromUrl]);

  const plan = getPlan(planId);
  const userCount = Math.min(Math.max(employees, 1), plan.maxUsers === -1 ? 100 : plan.maxUsers);
  const baseMonthly = plan.pricePerUserPerMonth * userCount;
  const addOnMonthly = MODULE_LIST.filter((m) => addOnIds.has(m.id)).reduce((s, m) => s + m.addOnPricePerMonth, 0);
  const totalMonthly = baseMonthly + addOnMonthly;

  const toggleAddOn = (id: string) => {
    if (isModuleIncludedInPlan(id, planId)) return;
    setAddOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-ground)" }}>
      <nav className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-ground)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href={ROUTES.home} className="flex shrink-0 items-center">
            <Image src={SITE.logoPath} alt={`${SITE.name} ${SITE.legal}`} width={140} height={42} className="h-9 w-auto object-contain" />
          </Link>
          <Link href={ROUTES.login} className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>Sign in</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-xl px-6 py-12">
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="h-2 w-12 rounded-full"
              style={{ background: step >= s ? "var(--color-primary)" : "var(--color-border)" }}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "var(--color-ink)" }}>Tell us about your business</h1>
            <form className="mt-8 space-y-4">
              <Input
                label="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Industries Inc."
              />
              <Select
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                options={[
                  { value: "", label: "Select industry" },
                  ...INDUSTRIES.map((i) => ({ value: i, label: i })),
                ]}
              />
              <Select
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                options={CARIBBEAN_COUNTRIES.map((c) => ({ value: c, label: c }))}
              />
              <Select
                label="Number of employees"
                value={String(employees)}
                onChange={(e) => setEmployees(Number(e.target.value))}
                options={[1, 5, 10, 25, 50, 100].map((n) => ({
                  value: String(n),
                  label: n === 100 ? "100+" : String(n),
                }))}
              />
              <Button variant="primary" size="md" type="button" onClick={() => setStep(2)} className="mt-6 w-full">
                Continue
              </Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "var(--color-ink)" }}>Choose your plan</h1>
            <p className="mt-2 text-sm" style={{ color: "var(--color-ink-tertiary)" }}>Recommended for {employees} employees: {employees <= 5 ? "Starter" : employees <= 25 ? "Growth" : "Enterprise"}.</p>
            <div className="mt-6 space-y-3">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlanId(p.id)}
                  className={`w-full rounded-xl border-2 p-4 text-left transition ${
                    planId === p.id ? "border-[var(--color-primary)] bg-[var(--color-ground-section)]" : "hover:opacity-90"
                  }`}
                  style={planId === p.id ? undefined : { borderColor: "var(--color-border)" }}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold" style={{ color: "var(--color-ink)" }}>{p.name}</span>
                    <span style={{ color: "var(--color-ink)" }}>${p.pricePerUserPerMonth}/user/mo</span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--color-ink-tertiary)" }}>{p.maxUsers === -1 ? "Unlimited users" : `Up to ${p.maxUsers} users`} · {p.storageGB === -1 ? "Unlimited storage" : `${p.storageGB} GB`}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" size="md" type="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" size="md" type="button" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "var(--color-ink)" }}>Pick modules</h1>
            <p className="mt-2 text-sm" style={{ color: "var(--color-ink-tertiary)" }}>Included in {plan.name}. Add more below if needed.</p>
            <div className="mt-6 max-h-80 overflow-y-auto pr-2">
              {CATEGORIES.map((cat) => {
                const catModules = MODULE_LIST.filter((m) => m.category === cat);
                if (catModules.length === 0) return null;
                return (
                  <div key={cat} className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>{cat}</p>
                    <div className="space-y-2">
                      {catModules.map((m) => {
                        const included = isModuleIncludedInPlan(m.id, planId);
                        const isAddOn = addOnIds.has(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => !included && toggleAddOn(m.id)}
                            disabled={included}
                            className={`w-full rounded-lg border p-3 text-left text-sm transition flex justify-between items-center ${
                              included ? "cursor-default opacity-90" : isAddOn ? "border-[var(--color-primary)] bg-[var(--color-ground-section)]" : "hover:opacity-90"
                            }`}
                            style={
                              included
                                ? { borderColor: "var(--color-border)", background: "var(--color-ground-section)" }
                                : isAddOn
                                ? undefined
                                : { borderColor: "var(--color-border)" }
                            }
                          >
                            <span className="font-medium" style={{ color: "var(--color-ink)" }}>{m.name}</span>
                            {included ? (
                              <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>Included</span>
                            ) : (
                              <span style={{ color: "var(--color-ink-secondary)" }}>+${m.addOnPricePerMonth}/mo</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-lg border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-ground-section)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Total: ${totalMonthly.toFixed(0)}/mo</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{userCount} users × ${plan.pricePerUserPerMonth} + {addOnIds.size} add-ons</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" size="md" type="button" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button variant="primary" size="md" type="button" onClick={() => setStep(4)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            {returnFromPayment ? (
              <>
                <h1 className="text-2xl font-semibold" style={{ color: "var(--color-ink)" }}>Payment submitted</h1>
                <p className="mt-2" style={{ color: "var(--color-ink-secondary)" }}>
                  Your payment is being processed. We&apos;ll activate your account shortly and email you at <strong>{email || "your email"}</strong>.
                </p>
                <Link
                  href={ROUTES.login}
                  className="mt-6 inline-block rounded-md px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  style={{ background: "var(--color-primary)" }}
                >
                  Go to sign in
                </Link>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold" style={{ color: "var(--color-ink)" }}>Create your account</h1>
                <form
                  className="mt-8 space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSignupError(null);
                    if (!csrfToken) {
                      setSignupError("Security token missing. Please refresh the page.");
                      return;
                    }
                    setSubmitting(true);
                    try {
                      const res = await fetch("/api/signup", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "X-CSRF-Token": csrfToken,
                        },
                        body: JSON.stringify({
                          email,
                          companyName: company,
                          plan: plan.name,
                          modulesSelected: [...plan.includedModuleIds, ...addOnIds],
                        }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        if (res.status === 403) {
                          setSignupError("Session expired. Please refresh and try again.");
                          setCsrfToken(null);
                          return;
                        }
                        const msg = typeof data?.error === "object" ? data.error?.message : data?.error;
                        setSignupError(msg || "Signup failed");
                        return;
                      }
                      const payload = data.data ?? data;
                      if (payload.paymentUrl) {
                        window.location.href = payload.paymentUrl;
                        return;
                      }
                      setSignupError(payload.message || "Account created. Contact support to complete payment.");
                    } catch {
                      setSignupError("Something went wrong. Please try again.");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <Input
                    label="Full name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div>
                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <ul className="mt-2 space-y-1 text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
                      {PASSWORD_REQUIREMENTS.map((r) => (
                        <li key={r.label} style={r.test(password) ? { color: "var(--color-success)" } : undefined}>
                          {r.test(password) ? "\u2713" : "\u25CB"} {r.label}
                        </li>
                      ))}
                    </ul>
                    {password.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2].map((i) => {
                          const passed = PASSWORD_REQUIREMENTS.filter((r) => r.test(password)).length;
                          return (
                            <div
                              key={i}
                              className="h-1.5 flex-1 rounded-full transition-colors"
                              style={{
                                background: i < passed
                                  ? passed === 3 ? "var(--color-success)" : passed >= 2 ? "var(--color-accent-gold)" : "var(--color-error)"
                                  : "var(--color-border)",
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {signupError && <p className="text-sm" style={{ color: "var(--color-error)" }}>{signupError}</p>}
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={submitting || !csrfToken}
                    className="mt-6 w-full"
                  >
                    {!csrfToken ? "Loading\u2026" : submitting ? "Setting up your workspace\u2026" : "Continue to payment (2Checkout)"}
                  </Button>
                  <p className="mt-2 text-center text-xs" style={{ color: "var(--color-ink-muted)" }}>You&apos;ll complete payment securely via 2Checkout. Cards and local payment methods supported.</p>
                </form>
                <button type="button" onClick={() => setStep(3)} className="mt-4 text-sm hover:opacity-100" style={{ color: "var(--color-ink-tertiary)" }}>
                  Back
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-ground)", color: "var(--color-ink-tertiary)" }}>Loading&hellip;</div>}>
      <SignupContent />
    </Suspense>
  );
}
