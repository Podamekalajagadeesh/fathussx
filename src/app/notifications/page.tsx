"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/components/auth-context";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadNotifications() {
      if (!user) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/notifications?userId=${encodeURIComponent(user.id)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load notifications");
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [router, user]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteNav />
        <div className="flex-1 py-12">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Notifications</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Stay on top of your learning</h1>
              <p className="mt-3 text-sm leading-7 text-slate-400">The app now surfaces helpful reminders and progress-based updates based on your real course activity.</p>
            </div>

            <div className="mt-8 space-y-4">
              {loading ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-6 text-sm text-slate-400">Loading your notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-6 text-sm text-slate-400">No notifications yet.</div>
              ) : notifications.map((notification) => (
                <div key={notification.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{notification.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-400">{notification.message}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${notification.type === "success" ? "bg-emerald-400/10 text-emerald-200" : "bg-cyan-400/10 text-cyan-200"}`}>
                      {notification.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
