const defaultCourses = [
  {
    slug: "ai-for-everyday-learning",
    title: "AI for Everyday Learning",
    category: "Technology",
    duration: "6 weeks",
    level: "Beginner",
    students: 12400,
    price: "$79",
    description: "Learn how to use AI tools to study smarter, write better, and accelerate everyday learning.",
    badges: "Live mentor sessions|Certificate",
    outcomes: "Understand AI fundamentals|Use AI for writing and research|Create a personalized study workflow",
  },
  {
    slug: "global-business-skills",
    title: "Global Business Skills",
    category: "Business",
    duration: "8 weeks",
    level: "Intermediate",
    students: 8100,
    price: "$99",
    description: "A practical course for entrepreneurs and professionals who want to thrive in borderless markets.",
    badges: "Case studies|Community access",
    outcomes: "Build a market-ready strategy|Communicate with global teams|Improve decision-making under pressure",
  },
  {
    slug: "creative-education-design",
    title: "Creative Education Design",
    category: "Teaching",
    duration: "5 weeks",
    level: "Advanced",
    students: 5200,
    price: "$89",
    description: "Design engaging lessons, interactive classrooms, and inclusive educational experiences.",
    badges: "Templates|Instructor toolkit",
    outcomes: "Design meaningful lesson plans|Use multimedia learning tools|Measure engagement clearly",
  },
];

function getDefaultCourses() {
  return defaultCourses;
}

async function ensureDefaultCourses(prisma) {
  const existingCount = await prisma.course.count();
  if (existingCount > 0) {
    return existingCount;
  }

  await prisma.$transaction(defaultCourses.map((course) => prisma.course.create({ data: course })));
  return defaultCourses.length;
}

module.exports = {
  defaultCourses,
  getDefaultCourses,
  ensureDefaultCourses,
};
