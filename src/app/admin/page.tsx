import { SiteNav } from "@/components/site-nav";
import { prisma } from "@/lib/db";

function parsePrice(price: string) {
  const value = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

interface AdminEnrollment {
  id: string;
  status: string;
  createdAt: Date;
  user: {
    name?: string | null;
    email: string;
  };
  course: {
    title: string;
  };
}

export default async function AdminPage() {
  const [activeLearners, totalEnrollments, completedEnrollments] = await Promise.all([
    prisma.user.count(),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "completed" } }),
  ]);

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 7,
    orderBy: { createdAt: "desc" },
    include: { user: true, course: true },
  }) as AdminEnrollment[];

  const revenueThisMonth = await prisma.enrollment
    .findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      include: { course: true },
    })
    .then((enrollments: { course: { price: string } }[]) =>
      enrollments.reduce((sum, enrollment) => sum + parsePrice(enrollment.course.price), 0),
    );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Admin center</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Run your platform with clarity.</h1>
              <p className="mt-3 text-sm leading-7 text-slate-400">Monitor active learners, enrollments, and revenue using live course data.</p>
            </div>
            <button className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Create campaign
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Active learners</p>
              <p className="mt-3 text-3xl font-semibold text-white">{activeLearners.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Course enrollments</p>
              <p className="mt-3 text-3xl font-semibold text-white">{totalEnrollments.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Completed enrollments</p>
              <p className="mt-3 text-3xl font-semibold text-white">{completedEnrollments.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-400">Revenue this month</p>
              <p className="mt-3 text-3xl font-semibold text-white">${revenueThisMonth.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Recent enrollments</h2>
                <p className="mt-2 text-sm text-slate-400">The latest learner activity from your live courses.</p>
              </div>
              <span className="text-sm text-slate-400">Updated just now</span>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-3">Learner</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/10 last:border-0">
                      <td className="py-3 text-white">{entry.user.name || entry.user.email}</td>
                      <td className="py-3">{entry.course.title}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
