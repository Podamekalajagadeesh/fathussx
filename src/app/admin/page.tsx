import { SiteNav } from "@/components/site-nav";
import { adminMetrics, recentEnrollments } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Admin center</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Run your platform with clarity.</h1>
            </div>
            <button className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Create campaign
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {adminMetrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Recent enrollments</h2>
              <span className="text-sm text-slate-400">Updated 5 min ago</span>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-3">Learner</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((entry) => (
                    <tr key={entry.learner} className="border-b border-white/10 last:border-0">
                      <td className="py-3 text-white">{entry.learner}</td>
                      <td className="py-3">{entry.course}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                          {entry.status}
                        </span>
                      </td>
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
