"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ROUTES, SITE } from "@/lib/config/site";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d: { data?: { token?: string }; token?: string }) => setCsrfToken(d.data?.token ?? d.token ?? null))
      .catch(() => setCsrfToken(null));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!csrfToken) {
      setError("Security token missing. Please refresh the page.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 403) {
          setError("Session expired. Please refresh and try again.");
          setCsrfToken(null);
          return;
        }
        const msg = typeof data?.error === "object" ? data.error?.message : data?.error;
        setError(msg || "Invalid credentials");
        return;
      }
      router.push(ROUTES.dashboard);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div
        className="relative flex min-h-screen w-[48%] flex-col items-center justify-center px-12"
        style={{ background: "var(--color-surface-dark)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ background: "radial-gradient(ellipse 60% 40% at 80% 50%, white, transparent)" }}
        />
        <div className="relative flex flex-col items-center text-center">
          <Image
            src={SITE.logoPath}
            alt={`${SITE.name} ${SITE.legal}`}
            width={180}
            height={54}
            className="h-14 w-auto object-contain brightness-0 invert"
          />
          <p className="mt-4 text-body" style={{ color: "var(--color-ink-muted)" }}>
            {SITE.tagline}
          </p>
        </div>
      </div>
      <div
        className="flex min-h-screen w-[52%] flex-col items-center justify-center"
        style={{ background: "var(--color-ground)" }}
      >
        <div className="w-full max-w-[400px] px-8">
          <h2 className="text-h2 font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
            Sign in
          </h2>
          <form onSubmit={handleSubmit} className="mt-10">
            <label className="text-label mb-2 block font-medium" style={{ color: "var(--color-ink-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-2"
              placeholder="you@company.com"
            />
            <label className="text-label mb-2 mt-5 block font-medium" style={{ color: "var(--color-ink-secondary)" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-2"
            />
            {error && (
              <p className="mt-4 text-caption" style={{ color: "hsl(0, 65%, 48%)" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !csrfToken}
              className="btn-primary mt-8 w-full disabled:opacity-60 disabled:transform-none"
            >
              {!csrfToken ? "Loading…" : loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-8 text-center text-body" style={{ color: "var(--color-ink-secondary)" }}>
            <Link href={ROUTES.signup} className="font-medium transition-opacity hover:opacity-100" style={{ color: "var(--color-ink)" }}>
              Don&apos;t have an account? Start free trial
            </Link>
          </p>
          <p className="mt-3 text-center text-caption">
            <Link href="mailto:support@westbridge.gy" className="transition-opacity hover:opacity-100">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
