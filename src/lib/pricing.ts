export type Course = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  students: string;
  price: string;
  description: string;
  badges: string[];
  outcomes: string[];
};

export const courses: Course[] = [
  {
    slug: "ai-for-everyday-learning",
    title: "AI for Everyday Learning",
    category: "Technology",
    duration: "6 weeks",
    level: "Beginner",
    students: "12.4k",
    price: "$79",
    description:
      "Learn how to use AI tools to study smarter, write better, and accelerate everyday learning.",
    badges: ["Live mentor sessions", "Certificate"],
    outcomes: ["Understand AI fundamentals", "Use AI for writing and research", "Create a personalized study workflow"],
  },
  {
    slug: "global-business-skills",
    title: "Global Business Skills",
    category: "Business",
    duration: "8 weeks",
    level: "Intermediate",
    students: "8.1k",
    price: "$99",
    description:
      "A practical course for entrepreneurs and professionals who want to thrive in borderless markets.",
    badges: ["Case studies", "Community access"],
    outcomes: ["Build a market-ready strategy", "Communicate with global teams", "Improve decision-making under pressure"],
  },
  {
    slug: "creative-education-design",
    title: "Creative Education Design",
    category: "Teaching",
    duration: "5 weeks",
    level: "Advanced",
    students: "5.2k",
    price: "$89",
    description:
      "Design engaging lessons, interactive classrooms, and inclusive educational experiences.",
    badges: ["Templates", "Instructor toolkit"],
    outcomes: ["Design meaningful lesson plans", "Use multimedia learning tools", "Measure engagement clearly"],
  },
];

export const adminMetrics = [
  { label: "Active learners", value: "24.8k" },
  { label: "Course completions", value: "61%" },
  { label: "Revenue this month", value: "$182k" },
];

export const recentEnrollments = [
  { learner: "Mina O", course: "AI for Everyday Learning", status: "Active" },
  { learner: "Daniel K", course: "Global Business Skills", status: "Pending" },
  { learner: "Lina T", course: "Creative Education Design", status: "Completed" },
];

export const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "For self-paced learners who want a structured study routine and daily progress support.",
    features: ["Access to 3 core courses", "Weekly study plans", "Community discussion space"],
  },
  {
    name: "Pro",
    price: "$49",
    description: "For learners who want mentor feedback, live sessions, and verified certificates.",
    features: ["Full course library", "Weekly live sessions", "AI mentor access"],
  },
  {
    name: "Campus",
    price: "Custom",
    description: "For schools and training teams that need reporting, onboarding, and shared learning spaces.",
    features: ["Bulk licenses", "Admin dashboard", "Priority support"],
  },
];
