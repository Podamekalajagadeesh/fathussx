"use client";

import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/components/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalCourses: number;
  inProgress: number;
  completed: number;
  certificates: number;
}

interface EnrollmentCourse {
  id: string;
  title: string;
  slug: string;
  category: string;
  duration: string;
  level: string;
  students: number;
  price: string;
}

interface Enrollment {
  id: string;
  status: string;
  createdAt: string;
  course: EnrollmentCourse;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingCourseId, setSavingCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadEnrollments() {
      if (!user) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/enrollment?userId=${encodeURIComponent(user.id)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load your courses.");
        }

        setEnrollments(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load your learning progress. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadEnrollments();
  }, [router, user]);

  if (!user) {
    return null;
  }

  const stats: DashboardStats = {
    totalCourses: enrollments.length,
    inProgress: enrollments.filter((enrollment) => enrollment.status === "active").length,
    completed: enrollments.filter((enrollment) => enrollment.status === "completed").length,
    certificates: enrollments.filter((enrollment) => enrollment.status === "completed").length,
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">My learning</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Welcome back, {user.name || user.email}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-400">Track your enrolled courses, review progress, and continue learning right away.</p>
            </div>
            <Link href="/courses" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Explore more courses
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Courses enrolled</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? "—" : stats.totalCourses}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">In progress</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? "—" : stats.inProgress}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Completed</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? "—" : stats.completed}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Certificates earned</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? "—" : stats.certificates}</p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">My courses</h2>
                <p className="mt-3 text-sm text-slate-400">Continue the courses you are enrolled in and revisit active lessons.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                Updated {loading ? "just now" : "recently"}
              </span>
            </div>

            {loading ? (
              <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-8 text-center text-slate-400">Loading your enrolled courses...</div>
            ) : error ? (
              <div className="mt-8 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-200">{error}</div>
            ) : enrollments.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
                <p className="text-lg font-semibold text-white">You haven't enrolled in any courses yet.</p>
                <p className="mt-2 text-sm text-slate-300">Start with one of our starter courses to build momentum and track your progress here.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/courses" className="inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                    Browse courses
                  </Link>
                  <Link href="/pricing" className="inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                    View plans
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link href={`/courses/${enrollment.course.slug}`} className="text-xl font-semibold text-white transition hover:text-cyan-300">
                          {enrollment.course.title}
                        </Link>
                        <p className="mt-2 text-sm text-slate-400">{enrollment.course.category} · {enrollment.course.level} · {enrollment.course.duration}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                          {enrollment.status}
                        </span>
                        <span className="text-sm text-slate-400">{new Date(enrollment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-700">
                      <div
                        className={`h-2 rounded-full ${enrollment.status === "completed" ? "bg-emerald-400" : "bg-cyan-400"}`}
                        style={{ width: enrollment.status === "completed" ? "100%" : enrollment.status === "active" ? "55%" : "30%" }}
                      />
                    </div>
                    {enrollment.status === "active" ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={async () => {
                            setSavingCourseId(enrollment.course.id);
                            setError(null);
                            const response = await fetch("/api/enrollment", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ userId: user.id, courseId: enrollment.course.id }),
                            });
                            const data = await response.json();
                            setSavingCourseId(null);

                            if (!response.ok) {
                              setError(data.error || "Unable to mark this course complete.");
                              return;
                            }

                            setEnrollments((current) =>
                              current.map((item) =>
                                item.id === enrollment.id ? { ...item, status: data.enrollment.status } : item,
                              ),
                            );
                          }}
                          disabled={savingCourseId === enrollment.course.id}
                          className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {savingCourseId === enrollment.course.id ? "Saving..." : "Mark complete"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
