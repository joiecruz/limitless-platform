export const BLOG_CATEGORIES = [
  "Design",
  "Innovation",
  "News and Updates",
  "Featured Stories",
  "Digital Literacy",
  "Artificial Intelligence"
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];