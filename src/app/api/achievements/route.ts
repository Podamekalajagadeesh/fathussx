import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
  });

  const completedCount = enrollments.filter((entry) => entry.status === "completed").length;

  const achievements = [
    {
      id: "first-course",
      title: "First Steps",
      description: "Enroll in your first course.",
      unlocked: enrollments.length > 0,
      icon: "🌱",
    },
    {
      id: "course-complete",
      title: "Finisher",
      description: "Complete your first course.",
      unlocked: completedCount > 0,
      icon: "🏅",
    },
    {
      id: "learning-streak",
      title: "Steady Learner",
      description: "Keep returning to your learning path.",
      unlocked: enrollments.length >= 2,
      icon: "🔥",
    },
  ];

  return NextResponse.json(achievements);
}
