import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      enrollments: {
        include: { course: true },
      },
    },
  });

  const leaderboard = users
    .map((user) => {
      const completedCourses = user.enrollments.filter((entry) => entry.status === "completed").length;
      const activeCourses = user.enrollments.filter((entry) => entry.status === "active").length;
      const score = completedCourses * 20 + activeCourses * 8;

      return {
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        score,
        completedCourses,
        activeCourses,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 10);

  return NextResponse.json(leaderboard);
}
