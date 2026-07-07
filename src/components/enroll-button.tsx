"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled?: boolean;
  status?: string;
  onEnroll?: (status: string) => void;
}

export function EnrollButton({ courseId, isEnrolled, status: enrollmentStatus, onEnroll }: EnrollButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [enrolled, setEnrolled] = useState(isEnrolled ?? false);

  useEffect(() => {
    setEnrolled(isEnrolled ?? false);
  }, [isEnrolled]);

  async function handleEnroll() {
    if (!user) {
      router.push("/login");
      return;
    }

    if (enrolled) {
      setStatus({ type: "success", message: "You are already enrolled in this course." });
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

    setEnrolled(true);
    setStatus({ type: "success", message: "Successfully enrolled! Check your dashboard." });
    onEnroll?.("active");
  }

  const buttonLabel = !user
    ? "Sign in to enroll"
    : enrolled
    ? enrollmentStatus === "completed"
      ? "Completed"
      : "Enrolled"
    : "Enroll now";

  return (
    <div className="space-y-3">
      <button
        onClick={handleEnroll}
        disabled={loading || (user ? enrolled : false)}
        className="w-full rounded-full bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Processing..." : buttonLabel}
      </button>
      {status ? (
        <p className={`rounded-2xl px-4 py-3 text-sm ${status.type === "success" ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
