"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";

interface ProfileStats {
  totalCourses: number;
  inProgress: number;
  completed: number;
  certificates: number;
}

interface ProfileEnrollment {
  id: string;
  status: string;
  createdAt: string;
  course: {
    title: string;
    slug: string;
    category: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [enrollments, setEnrollments] = useState<ProfileEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      if (!user) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/profile?userId=${encodeURIComponent(user.id)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load profile");
        setStats(data.stats);
        setEnrollments(data.enrollments);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router, user]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Learner profile</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">{user.name || user.email}</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">Track your growth, review completed courses, and keep going on your roadmap.</p>
              </div>
              <Link href="/dashboard" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                Go to dashboard
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                { label: "Courses enrolled", value: loading ? "—" : stats?.totalCourses ?? 0 },
                { label: "In progress", value: loading ? "—" : stats?.inProgress ?? 0 },
                { label: "Completed", value: loading ? "—" : stats?.completed ?? 0 },
                { label: "Certificates", value: loading ? "—" : stats?.certificates ?? 0 },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/50 p-6">
              <h2 className="text-2xl font-semibold text-white">Recent learning activity</h2>
              {loading ? (
                <p className="mt-4 text-sm text-slate-400">Loading your course history…</p>
              ) : enrollments.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400">
                  No learning activity yet. Enroll in a course to begin your path.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {enrollments.map((entry) => (
                    <div key={entry.id} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{entry.course.title}</p>
                        <p className="text-sm text-slate-400">{entry.course.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                          {entry.status}
                        </span>
                        <span className="text-sm text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</span>
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
