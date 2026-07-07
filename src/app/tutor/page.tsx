"use client";

import { FormEvent, useState } from "react";
import { SiteNav } from "@/components/site-nav";

export default function TutorPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get tutor response");
      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("I’m not able to help right now. Try asking about a course, quiz, or study plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">AI tutor</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Ask for help and get a focused learning response</h1>
              <p className="mt-3 text-sm leading-7 text-slate-400">The tutor uses your current course catalog to suggest practical next steps and study guidance.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                placeholder="Ask about a course, quiz, study plan, or what to learn next"
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">Examples: “Which course should I start with?” or “How do I study better?”</p>
                <button type="submit" disabled={loading} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70">
                  {loading ? "Thinking…" : "Ask tutor"}
                </button>
              </div>
            </form>

            <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <h2 className="text-xl font-semibold text-white">Tutor response</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{answer || "Your answers will appear here after you ask a question."}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
