import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, courseId } = body;

  if (!userId || !courseId) {
    return NextResponse.json({ error: "userId and courseId required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const existing = await prisma.enrollment.findFirst({
    where: { userId, courseId },
  });

  if (existing) {
    return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId, courseId, status: "active" },
  });

  await prisma.course.update({
    where: { id: courseId },
    data: { students: { increment: 1 } },
  });

  return NextResponse.json({ enrollment }, { status: 201 });
}

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

  return NextResponse.json(enrollments);
}
