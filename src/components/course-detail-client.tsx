"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { EnrollButton } from "@/components/enroll-button";
import { useAuth } from "@/components/auth-context";

const lessons = [
  {
    id: "overview",
    title: "Start with the big picture",
    summary: "Understand the goal of this learning path and how each lesson connects to real practice.",
    duration: "5 min",
    type: "Reading",
  },
  {
    id: "practice",
    title: "Apply the idea in a guided exercise",
    summary: "Try a short challenge that turns the concept into something you can use right away.",
    duration: "8 min",
    type: "Exercise",
  },
  {
    id: "quiz",
    title: "Complete a quick mastery check",
    summary: "Answer a short quiz to confirm your understanding before you move on.",
    duration: "3 min",
    type: "Quiz",
  },
];

const quizQuestions = [
  {
    id: "q1",
    prompt: "What is the best first step when learning a new skill?",
    options: ["Start with a simple foundation", "Skip the basics", "Wait until the end"],
    answer: "Start with a simple foundation",
  },
  {
    id: "q2",
    prompt: "Which habit helps you retain what you learn?",
    options: ["Practice regularly", "Avoid notes", "Rush through everything"],
    answer: "Practice regularly",
  },
];

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
  const { user } = useAuth();
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  useEffect(() => {
    async function loadEnrollmentStatus() {
      if (!user) {
        setEnrollmentStatus(null);
        return;
      }

      const response = await fetch(`/api/enrollment?userId=${encodeURIComponent(user.id)}`);
      if (!response.ok) {
        setStatus({ type: "error", message: "Unable to fetch your enrollment status." });
        return;
      }

      const data = await response.json();
      const existing = data.find((entry: { course: { id: string }; status: string }) => entry.course.id === id);
      setEnrollmentStatus(existing?.status ?? null);
    }

    loadEnrollmentStatus();
  }, [id, user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storageKey = `fathussx:course-progress:${user?.id ?? "guest"}:${id}`;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) {
          setCompletedLessons(parsed);
        }
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storageKey = `fathussx:course-progress:${user?.id ?? "guest"}:${id}`;
    window.localStorage.setItem(storageKey, JSON.stringify(completedLessons));
  }, [completedLessons, id, user?.id]);

  function toggleLesson(lessonId: string) {
    setCompletedLessons((current) =>
      current.includes(lessonId) ? current.filter((item) => item !== lessonId) : [...current, lessonId],
    );
  }

  function handleQuizAnswer(questionId: string, value: string) {
    setQuizAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function submitQuiz() {
    const correctAnswers = quizQuestions.filter((question) => quizAnswers[question.id] === question.answer).length;
    const passed = correctAnswers >= 1;

    setQuizResult(
      passed
        ? `Nice work! You scored ${correctAnswers}/${quizQuestions.length}.`
        : `You answered ${correctAnswers}/${quizQuestions.length}. Try the lesson again and refresh your understanding.`,
    );

    if (passed) {
      setCompletedLessons((current) => (current.includes("quiz") ? current : [...current, "quiz"]));
    }
  }

  const progressPercent = Math.round((completedLessons.length / lessons.length) * 100);

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
                <div className="mt-6 space-y-3">
                  <EnrollButton
                    courseId={id}
                    isEnrolled={Boolean(enrollmentStatus)}
                    status={enrollmentStatus ?? undefined}
                    onEnroll={() => {
                      setEnrollmentStatus("active");
                      setStatus({ type: "success", message: "Successfully enrolled! Check your dashboard." });
                    }}
                  />
                  {enrollmentStatus === "active" ? (
                    <button
                      onClick={async () => {
                        if (!user) {
                          setStatus({ type: "error", message: "Sign in to complete this course." });
                          return;
                        }

                        const response = await fetch("/api/enrollment", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: user?.id, courseId: id }),
                        });

                        const data = await response.json();
                        if (!response.ok) {
                          setStatus({ type: "error", message: data.error || "Unable to update course to completed." });
                          return;
                        }
                        setEnrollmentStatus(data.enrollment.status);
                        setStatus({ type: "success", message: "Course marked complete. Nice work!" });
                      }}
                      className="w-full rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Mark course complete
                    </button>
                  ) : null}
                </div>
                {enrollmentStatus ? (
                  <p className="mt-4 text-sm text-slate-300">You are currently enrolled in this course ({enrollmentStatus}).</p>
                ) : null}
                {status ? (
                  <p
                    className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                      status.type === "success" ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"
                    }`}
                  >
                    {status.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-xl shadow-cyan-500/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Study path</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">A simple learning experience for this course</h2>
                <p className="mt-2 text-sm text-slate-400">Follow the lessons, complete the quick quiz, and build momentum as you go.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
                Progress: {completedLessons.length}/{lessons.length} steps • {progressPercent}%
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {lessons.map((lesson) => {
                const completed = completedLessons.includes(lesson.id);
                return (
                  <div key={lesson.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                            {lesson.type}
                          </span>
                          <span className="text-sm text-slate-400">{lesson.duration}</span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">{lesson.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{lesson.summary}</p>
                      </div>
                      <button
                        onClick={() => toggleLesson(lesson.id)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${completed ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
                      >
                        {completed ? "Completed" : "Mark complete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <h3 className="text-xl font-semibold text-white">Quick quiz</h3>
              <p className="mt-2 text-sm text-slate-300">Choose the best answer to reinforce the lesson and unlock the final step.</p>
              <div className="mt-5 space-y-4">
                {quizQuestions.map((question) => (
                  <div key={question.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm font-semibold text-white">{question.prompt}</p>
                    <div className="mt-3 space-y-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={quizAnswers[question.id] === option}
                            onChange={() => handleQuizAnswer(question.id, option)}
                            className="accent-cyan-400"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={submitQuiz}
                className="mt-6 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Submit quiz
              </button>
              {quizResult ? (
                <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${quizResult.includes("Nice work") ? "bg-emerald-500/10 text-emerald-200" : "bg-amber-500/10 text-amber-200"}`}>
                  {quizResult}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
