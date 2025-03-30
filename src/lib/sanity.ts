import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Regular client
export const client = createClient({
  projectId: '42h9veeb',
  dataset: 'production',
  apiVersion: '2024-03-30',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});

// Preview client
export const previewClient = createClient({
  projectId: '42h9veeb',
  dataset: 'production',
  apiVersion: '2024-03-30',
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
});

// Helper to get the right client
export const getClient = (preview = false) => (preview ? previewClient : client);

// Set up image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Helper function to fetch blog posts
export async function getBlogPosts(preview = false) {
  return getClient(preview).fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      "author": author->name,
      "categories": categories[]->title,
      "tags": tags[]->title
    }
  `);
}

// Helper function to fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string, preview = false) {
  return getClient(preview).fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      mainImage,
      body,
      publishedAt,
      excerpt,
      "author": author->name,
      "categories": categories[]->title,
      "tags": tags[]->title,
      "relatedPosts": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.categories[]._ref]) > 0] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt
      }
    }
  `, { slug });
}

// Helper function to fetch all tags with post counts
export async function getAllTags() {
  return client.fetch(`
    *[_type == "tag"] {
      _id,
      title,
      "name": title,
      "count": count(*[_type == "post" && references(^._id)])
    } | order(count desc)
  `);
} 