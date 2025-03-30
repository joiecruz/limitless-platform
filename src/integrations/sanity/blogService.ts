
import { sanityClient } from './client';
import { SanityBlogPost } from './types';

// Fetch all blog posts
export async function getAllBlogPosts(): Promise<SanityBlogPost[]> {
  return sanityClient.fetch(`
    *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      _createdAt,
      title,
      slug,
      excerpt,
      mainImage,
      categories[]->{
        _id,
        title
      },
      publishedAt,
      meta_description,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
    }
  `);
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost> {
  return sanityClient.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      slug,
      excerpt,
      mainImage,
      categories[]->{
        _id,
        title
      },
      publishedAt,
      body,
      meta_description,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
      author->{name, image}
    }
  `, { slug });
}
