"use client";

import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/components/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">My learning</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Welcome back, {user.name || user.email}</h1>
            </div>
            <Link href="/courses" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Explore more courses
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Courses enrolled</p>
              <p className="mt-3 text-3xl font-semibold text-white">3</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">In progress</p>
              <p className="mt-3 text-3xl font-semibold text-white">2</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Completed</p>
              <p className="mt-3 text-3xl font-semibold text-white">1</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Certificates earned</p>
              <p className="mt-3 text-3xl font-semibold text-white">1</p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-2xl font-semibold text-white">My enrollments</h2>
            <p className="mt-3 text-sm text-slate-400">View and manage all your active courses and learning progress here.</p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">AI for Everyday Learning</p>
                    <p className="text-sm text-slate-400">3 weeks in • 45% complete</p>
                  </div>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">In progress</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-700">
                  <div className="h-2 w-[45%] rounded-full bg-cyan-400"></div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Global Business Skills</p>
                    <p className="text-sm text-slate-400">Enrolled 5 days ago</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">Started</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-700">
                  <div className="h-2 w-[5%] rounded-full bg-cyan-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
