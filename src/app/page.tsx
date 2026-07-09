import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { prisma } from "@/lib/db";

const features = [
  {
    title: "Structured learning paths",
    description: "Learners move from onboarding to mastery with clear milestones, guided practice, and progress tracking.",
  },
  {
    title: "Mentor-led support",
    description: "Courses are paired with live guidance, feedback loops, and community interaction that keeps momentum high.",
  },
  {
    title: "Verifiable credentials",
    description: "Certificates and completion records are attached to every finished course so learners can share momentum with confidence.",
  },
];

export default async function Home() {
  const [courseCount, enrollmentCount, learnerCount] = await Promise.all([
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.user.count({ where: { role: { not: "admin" } } }),
  ]);

  const stats = [
    { value: `${learnerCount.toLocaleString()}+`, label: "active learners" },
    { value: `${courseCount.toLocaleString()}+`, label: "curated courses" },
    { value: `${enrollmentCount.toLocaleString()}+`, label: "live enrollments" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.25),_transparent_35%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />

        <div className="flex flex-1 flex-col justify-center py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                Trusted by learners, educators, and growing institutions
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Build practical skills with a platform that keeps learning moving.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                FathusX connects real courses, guided study plans, and measurable progress in one place so learners can stay accountable and move forward.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/courses"
                  className="rounded-full bg-cyan-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Explore courses
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/20"
                >
                  View plans
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur">
              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-violet-500/20 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200">
                  Live learning snapshot
                </p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Current momentum</span>
                      <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs text-emerald-300">
                        Active now
                      </span>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-700">
                      <div className="h-2 w-3/4 rounded-full bg-cyan-400"></div>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Study sessions</p>
                      <p className="mt-1 text-xl font-semibold text-white">{enrollmentCount.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Available courses</p>
                      <p className="mt-1 text-xl font-semibold text-white">{courseCount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-white/10 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Why FathusX</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Built for serious learners and growing learning teams.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© 2026 FathusX. Learning that grows with you.</p>
          <a href="mailto:hello@fathusx.com" className="text-cyan-300 transition hover:text-cyan-200">
            hello@fathusx.com
          </a>
        </div>
      </footer>
    </main>
  );
}
