"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-context";

interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  students: number;
  price: string;
  description: string;
  badges: string;
}

interface EnrollmentStatus {
  [courseId: string]: string;
}

export function CoursesListClient({ courses }: { courses: CourseSummary[] }) {
  const { user } = useAuth();
  const [enrolledStatus, setEnrolledStatus] = useState<EnrollmentStatus>({});
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    if (!user) {
      setEnrolledStatus({});
      return;
    }

    const userId = user.id;
    let active = true;

    async function loadEnrollments() {
      try {
        const response = await fetch(`/api/enrollment?userId=${encodeURIComponent(userId)}`);
        if (!response.ok) {
          console.warn("Failed to load enrollments", response.status);
          return;
        }
        const data = await response.json();
        if (!active) return;
        const statusMap: EnrollmentStatus = {};
        data.forEach((enrollment: { course: { id: string }; status: string }) => {
          statusMap[enrollment.course.id] = enrollment.status;
        });
        setEnrolledStatus(statusMap);
      } catch (error) {
        console.warn("Could not load enrollments", error);
      }
    }

    loadEnrollments();
    return () => {
      active = false;
    };
  }, [user]);

  const visibleCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query);
      const matchesLevel = level === "All" || course.level === level;
      return matchesSearch && matchesLevel;
    });
  }, [courses, level, search]);

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-500/10 md:flex-row md:items-center md:justify-between">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 md:max-w-sm"
          placeholder="Search courses or topics"
        />
        <select
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
        >
          <option value="All">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
      {visibleCourses.map((course) => {
        const status = enrolledStatus[course.id];
        return (
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
              {course.badges.split("|").map((badge) => (
                <span key={badge} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <span>{course.duration}</span>
              <span>{course.students.toLocaleString()} learners</span>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl font-semibold text-white">{course.price}</span>
                <Link
                  href={`/courses/${course.slug}`}
                  className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  View details
                </Link>
              </div>
              {status ? (
                <span className="inline-flex items-center justify-center rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {status === "completed" ? "Completed" : "Enrolled"}
                </span>
              ) : null}
            </div>
          </article>
        );
      })}
      </div>
    </div>
  );
}
