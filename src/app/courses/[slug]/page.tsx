import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { CourseDetailClient } from "@/components/course-detail-client";
import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({ select: { slug: true } });
  return courses.map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
  });

  if (!course) {
    notFound();
  }

  return (
    <CourseDetailClient
      id={course.id}
      slug={course.slug}
      title={course.title}
      category={course.category}
      duration={course.duration}
      level={course.level}
      description={course.description}
      price={course.price}
      students={course.students}
      outcomes={course.outcomes}
    />
  );
}
