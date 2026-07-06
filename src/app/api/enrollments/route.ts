import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, courseId } = body;

  if (!userId || !courseId) {
    return NextResponse.json({ error: "userId and courseId are required" }, { status: 400 });
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      user: { connect: { id: userId } },
      course: { connect: { id: courseId } },
    },
  });

  await prisma.course.update({
    where: { id: courseId },
    data: { students: { increment: 1 } },
  });

  return NextResponse.json(enrollment, { status: 201 });
}
