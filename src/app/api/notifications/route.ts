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

  const notifications = [
    {
      id: "welcome",
      title: "Welcome back",
      message: "Your learning dashboard is ready. Continue where you left off.",
      type: "info",
    },
    ...(enrollments.length > 0
      ? [
          {
            id: "enrolled",
            title: "Active course",
            message: `You are currently enrolled in ${enrollments[0].course.title}.`,
            type: "success",
          },
        ]
      : []),
  ];

  return NextResponse.json(notifications);
}
