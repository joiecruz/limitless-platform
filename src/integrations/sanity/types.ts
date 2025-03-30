
// Common types for Sanity data
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

// For blog posts
export interface SanityBlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  mainImage: SanityImage;
  categories: Array<{
    _id: string;
    title: string;
  }>;
  publishedAt: string;
  body: any; // This will be rich text content
  author: {
    name: string;
    image: SanityImage;
  };
  meta_description?: string;
}

// For case studies
export interface SanityCaseStudy {
  _id: string;
  _createdAt: string;
  name: string;
  slug: {
    current: string;
  };
  description: string;
  coverImage: SanityImage;
  additionalImage1?: SanityImage;
  additionalImage2?: SanityImage;
  client?: string;
  services?: string[];
  sdgs?: string[];
  problemOpportunity?: any; // Rich text
  approach?: any; // Rich text
  impact?: any; // Rich text
  quoteFromCustomer?: string;
}
