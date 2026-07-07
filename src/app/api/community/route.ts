import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = [
    {
      id: "post-1",
      author: "Mina",
      role: "Learner",
      message: "Finished my first lesson and I already feel more confident."
    },
    {
      id: "post-2",
      author: "Aarav",
      role: "Mentor",
      message: "Consistency beats intensity. Keep showing up for 15 minutes a day."
    }
  ];

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { author, role, message } = body;

  if (!author || !message) {
    return NextResponse.json({ error: "author and message are required" }, { status: 400 });
  }

  return NextResponse.json({
    id: `post-${Date.now()}`,
    author,
    role: role || "Learner",
    message,
  }, { status: 201 });
}
