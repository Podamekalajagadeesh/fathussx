import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureDefaultCourses } from "@/lib/seed-data";

export async function GET() {
  await ensureDefaultCourses(prisma);

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}
