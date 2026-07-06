import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { prisma } from "@/lib/db";

export const revalidate = 10;

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Explore courses</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
              Choose a path that matches your ambition.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Browse live and self-paced classes for learners, educators, and organizations around the world.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {courses.map((course) => (
              <article key={course.slug} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-cyan-500/10">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    {course.category}
                  </span>
                  <span className="text-sm text-slate-400">{course.level}</span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-white">{course.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{course.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {course.badges.split("|").map((badge: string) => (
                    <span key={badge} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                  <span>{course.duration}</span>
                  <span>{course.students.toLocaleString()} learners</span>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xl font-semibold text-white">{course.price}</span>
                  <Link href={`/courses/${course.slug}`} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
