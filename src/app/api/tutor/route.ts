import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { question } = body;

  if (!question) {
    return NextResponse.json({ error: "question required" }, { status: 400 });
  }

  const courses = await prisma.course.findMany({ take: 5 });
  const courseTitles = courses.map((course) => course.title).join(", ");

  const lowerQuestion = question.toLowerCase();
  let answer = "I can help you structure your study plan. Start with one course, review the outcomes, and complete the lessons step by step.";

  if (lowerQuestion.includes("course") || lowerQuestion.includes("learn")) {
    answer = `You can begin with these starter courses: ${courseTitles}. Choose one that matches your current goal and work through it in order.`;
  }

  if (lowerQuestion.includes("quiz") || lowerQuestion.includes("practice")) {
    answer = "A good next step is to complete the lesson summary, then answer the quick quiz to confirm your understanding before moving on.";
  }

  if (lowerQuestion.includes("schedule") || lowerQuestion.includes("plan")) {
    answer = "Try a simple plan of 20 minutes a day: review one lesson, take notes, and finish one short exercise before you stop.";
  }

  return NextResponse.json({ answer });
}
