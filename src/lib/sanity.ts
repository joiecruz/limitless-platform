
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Hardcoded token for direct use
const SANITY_TOKEN = 'skiDdn7nX4ZdoPx4Sl0kg4uAvAGSgpb9mdFKS2KwfrvffzzYT0eULAPhOJ9oXVUzGzPYIwP0bsA1SW0ZmIjKgqjiGCVV7s8iii1gLTZncg1zu7izaXlfV797uymPZTsqsNdsA6WUtHDv4wVf0Cj0U04qIxgO01DXnnpuSUfoQxCJuReVUb6y';

// Regular client with extensive debugging
export const client = createClient({
  projectId: '42h9veeb',
  dataset: 'production',
  apiVersion: '2024-03-30', 
  useCdn: false, // Disable CDN to ensure fresh data during debugging
  perspective: 'published',
  token: SANITY_TOKEN,
});

// Preview client
export const previewClient = createClient({
  projectId: '42h9veeb',
  dataset: 'production',
  apiVersion: '2024-03-30',
  useCdn: false,
  perspective: 'previewDrafts',
  token: SANITY_TOKEN,
});

// Helper to get the right client
export const getClient = (preview = false) => (preview ? previewClient : client);

// Set up image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Helper function to fetch blog posts with enhanced debugging
export async function getBlogPosts(preview = false) {
  console.log('=== SANITY FETCH ATTEMPT ===');
  console.log('Fetching blog posts with preview:', preview);
  console.log('Project ID:', '42h9veeb');
  console.log('Dataset:', 'production');
  
  const currentClient = getClient(preview);
  
  try {
    console.log('Executing Sanity query for posts...');
    const query = `
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
    `;
    console.log('Query:', query);
    
    const posts = await currentClient.fetch(query);
    
    console.log('Raw response:', JSON.stringify(posts).substring(0, 200) + '...');
    console.log('Fetched posts count:', posts?.length || 0);
    
    if (!posts || posts.length === 0) {
      console.log('WARNING: No posts returned from Sanity');
    }
    
    return posts;
  } catch (error) {
    console.error('ERROR fetching blog posts:', error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

// Helper function to fetch a single blog post by slug with better error handling
export async function getBlogPostBySlug(slug: string, preview = false) {
  console.log('Fetching blog post with slug:', slug, 'preview:', preview);
  const currentClient = getClient(preview);
  
  try {
    const post = await currentClient.fetch(`
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
    console.log('Fetched post:', post?._id || 'None found');
    return post;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    // Return null instead of throwing to prevent app crashes
    return null;
  }
}

// Helper function to fetch all tags with post counts with better error handling
export async function getAllTags() {
  console.log('Fetching all tags');
  try {
    const tags = await client.fetch(`
      *[_type == "tag"] {
        _id,
        title,
        "name": title,
        "count": count(*[_type == "post" && references(^._id)])
      } | order(count desc)
    `);
    console.log('Fetched tags:', tags?.length || 0);
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}
