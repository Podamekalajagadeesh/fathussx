import { SiteNav } from "@/components/site-nav";
import { prisma } from "@/lib/db";
import { CoursesListClient } from "@/components/courses-list-client";
import { ensureDefaultCourses } from "@/lib/seed-data";

export const revalidate = 10;

export default async function CoursesPage() {
  await ensureDefaultCourses(prisma);

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
          <CoursesListClient courses={courses} />
        </div>
      </section>
    </main>
  );
}
