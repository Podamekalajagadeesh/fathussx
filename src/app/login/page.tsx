"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus({ type: "error", message: data.error || "Login failed" });
      return;
    }

    setStatus({ type: "success", message: `Welcome back, ${data.user.name || data.user.email}!` });
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Sign in to FathusX</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">Continue your learning journey and access your dashboard.</p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                  placeholder="you@example.com"
                  type="email"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
            {status ? (
              <p className={`mt-5 rounded-2xl px-4 py-3 text-sm ${status.type === "success" ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
                {status.message}
              </p>
            ) : null}
            <p className="mt-6 text-center text-sm text-slate-400">
              New here?{' '}
              <Link href="/signup" className="text-cyan-300 transition hover:text-cyan-200">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
