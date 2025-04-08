
export const BLOG_CATEGORIES = [
  "Design",
  "Innovation",
  "Digital Transformation",
  "AI & Technology",
  "Thought Leadership",
  "Case Studies",
  "Workshops & Events",
  "Product Development",
  "Research & Insights",
  "Team & Culture",
  "Sustainability",
  "News & Updates"
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];
