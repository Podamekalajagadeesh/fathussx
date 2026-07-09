"use client";

import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { plans } from "@/lib/pricing";

export default function PricingPage() {
  const [selected, setSelected] = useState(plans[0].name);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selected }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus({ type: "error", message: data.error || "Unable to start checkout." });
      return;
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setStatus({ type: "success", message: data.message || "Checkout started." });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Plans</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
              Flexible pricing for every learner and institution.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Start small, expand as your goals grow, or bring a whole campus onto one platform.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-6 shadow-xl shadow-cyan-500/10 transition ${selected === plan.name ? "border-cyan-400/50 bg-slate-900/80" : "border-white/10 bg-slate-950/70"}`}
                onClick={() => setSelected(plan.name)}
              >
                <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{plan.description}</p>
                <p className="mt-6 text-4xl font-semibold text-white">{plan.price}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-cyan-300">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-8 w-full rounded-full bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Select plan
                </button>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Ready to enroll</p>
                <p className="mt-2 text-lg text-slate-300">Selected: {selected}</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Preparing checkout…" : "Start checkout"}
              </button>
            </div>
            {status ? (
              <p className={`mt-5 rounded-2xl px-4 py-3 text-sm ${status.type === "success" ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
                {status.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
