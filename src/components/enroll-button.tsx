"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleEnroll() {
    if (!user) {
      setStatus({ type: "error", message: "Please sign in to enroll" });
      return;
    }

    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/enrollment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, courseId }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus({ type: "error", message: data.error || "Enrollment failed" });
      return;
    }

    setStatus({ type: "success", message: "Successfully enrolled! Check your dashboard." });
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full rounded-full bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Enrolling..." : user ? "Enroll now" : "Sign in to enroll"}
      </button>
      {status ? (
        <p className={`rounded-2xl px-4 py-3 text-sm ${status.type === "success" ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
