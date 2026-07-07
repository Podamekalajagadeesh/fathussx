"use client";

import { FormEvent, useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/components/auth-context";

interface CommunityPost {
  id: string;
  author: string;
  role: string;
  message: string;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/community");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to load posts");
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: user?.name || user?.email || "You",
      role: user ? "Learner" : "Guest",
      message: message.trim(),
    };

    setPosts((current) => [newPost, ...current]);
    setMessage("");

    await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Community</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">Share momentum with other learners</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">Drop a quick update, celebrate progress, or encourage someone else on their path.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                placeholder="What are you learning today?"
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">A short note helps build the culture of the platform.</p>
                <button type="submit" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Post update
                </button>
              </div>
            </form>

            <div className="mt-8 space-y-4">
              {loading ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-6 text-sm text-slate-400">Loading community updates...</div>
              ) : posts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{post.author}</p>
                      <p className="text-sm text-slate-400">{post.role}</p>
                    </div>
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      Community
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{post.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
