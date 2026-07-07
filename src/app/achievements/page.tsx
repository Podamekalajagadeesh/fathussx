"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/components/auth-context";

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export default function AchievementsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadAchievements() {
      if (!user) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/achievements?userId=${encodeURIComponent(user.id)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load achievements");
        setAchievements(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, [router, user]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Achievements</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">Celebrate your learning milestones</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">Every completed step is worth recognizing. Keep going and unlock more badges.</p>
              </div>
              <Link href="/dashboard" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                Back to dashboard
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {loading ? (
                <div className="md:col-span-3 rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-6 text-sm text-slate-400">
                  Loading your achievements...
                </div>
              ) : achievements.map((achievement) => (
                <div key={achievement.id} className={`rounded-3xl border p-6 ${achievement.unlocked ? "border-emerald-400/20 bg-emerald-400/10" : "border-white/10 bg-slate-900/60"}`}>
                  <div className="text-4xl">{achievement.icon}</div>
                  <h2 className="mt-4 text-xl font-semibold text-white">{achievement.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{achievement.description}</p>
                  <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${achievement.unlocked ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-slate-300"}`}>
                    {achievement.unlocked ? "Unlocked" : "Locked"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
