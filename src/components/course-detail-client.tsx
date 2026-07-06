"use client";

import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { EnrollButton } from "@/components/enroll-button";

interface CourseDetailClientProps {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  description: string;
  price: string;
  students: number;
  outcomes: string;
}

export function CourseDetailClient({ id, slug, title, category, duration, level, description, price, students, outcomes }: CourseDetailClientProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_35%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <Link href="/courses" className="text-sm text-cyan-300 transition hover:text-cyan-200">
            ← Back to courses
          </Link>
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                {category}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                {duration}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
                {level}
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{description}</p>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.7fr]">
              <div>
                <h2 className="text-xl font-semibold text-white">What you will gain</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {outcomes.split("|").map((outcome: string) => (
                    <li key={outcome} className="flex items-center gap-2">
                      <span className="text-cyan-300">•</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Enrollment</p>
                <p className="mt-4 text-4xl font-semibold text-white">{price}</p>
                <p className="mt-2 text-sm text-slate-300">{students.toLocaleString()} learners joined</p>
                <div className="mt-6">
                  <EnrollButton courseId={id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
