"use client";

import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";

interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  score: number;
  completedCourses: number;
  activeCourses: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to load leaderboard");
        setEntries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Leaderboard</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">Top learners this week</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">Progress is tracked through courses started and completed, giving learners a visible benchmark.</p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">
              {loading ? (
                <div className="p-6 text-sm text-slate-400">Loading leaderboard...</div>
              ) : entries.length === 0 ? (
                <div className="p-6 text-sm text-slate-400">No leaderboard activity yet.</div>
              ) : (
                <div className="divide-y divide-white/10">
                  {entries.map((entry, index) => (
                    <div key={entry.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20 text-sm font-semibold text-cyan-200">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{entry.name}</p>
                          <p className="text-sm text-slate-400">{entry.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200">{entry.completedCourses} completed</span>
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-200">{entry.activeCourses} active</span>
                        <span className="rounded-full bg-white/10 px-3 py-1">Score {entry.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
