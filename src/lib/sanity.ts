
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Create a more robust client with fallback
export const client = createClient({
  projectId: '42h9veeb',
  dataset: 'production',
  apiVersion: '2023-03-30', // Try using a slightly older API version
  useCdn: false, // Disable CDN for consistent results
  token: 'skiDdn7nX4ZdoPx4Sl0kg4uAvAGSgpb9mdFKS2KwfrvffzzYT0eULAPhOJ9oXVUzGzPYIwP0bsA1SW0ZmIjKgqjiGCVV7s8iii1gLTZncg1zu7izaXlfV797uymPZTsqsNdsA6WUtHDv4wVf0Cj0U04qIxgO01DXnnpuSUfoQxCJuReVUb6y',
  timeout: 60, // Increase timeout to 60 seconds
});

// Preview client
export const previewClient = createClient({
  projectId: '42h9veeb',
  dataset: 'production',
  apiVersion: '2023-03-30', // Match the main client version
  useCdn: false,
  perspective: 'previewDrafts',
  token: 'skiDdn7nX4ZdoPx4Sl0kg4uAvAGSgpb9mdFKS2KwfrvffzzYT0eULAPhOJ9oXVUzGzPYIwP0bsA1SW0ZmIjKgqjiGCVV7s8iii1gLTZncg1zu7izaXlfV797uymPZTsqsNdsA6WUtHDv4wVf0Cj0U04qIxgO01DXnnpuSUfoQxCJuReVUb6y',
  timeout: 60,
});

// Helper to get the right client
export const getClient = (preview = false) => (preview ? previewClient : client);

// Set up image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Helper function to fetch blog posts with enhanced error handling
export async function getBlogPosts(preview = false) {
  console.log('=== SANITY FETCH ATTEMPT ===');
  console.log('Fetching blog posts with preview:', preview);
  
  try {
    // Try to fetch directly, with basic query
    const currentClient = getClient(preview);
    
    // Simplified query to reduce chances of syntax errors
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt
    }`;
    
    console.log('Executing simplified Sanity query...');
    const posts = await currentClient.fetch(query);
    
    console.log('Posts fetched successfully, count:', posts?.length || 0);
    return posts;
  } catch (error) {
    console.error('SANITY CONNECTION ERROR:', error);
    
    // Try a fallback approach with mock data for development
    if (import.meta.env.DEV) {
      console.log('Using fallback mock data in development mode');
      return [
        {
          _id: 'mock-1',
          title: 'Mock Blog Post 1',
          slug: { current: 'mock-post-1' },
          mainImage: null,
          publishedAt: new Date().toISOString(),
          excerpt: 'This is a mock post used when Sanity connection fails',
          author: 'Development Team',
          categories: ['Development'],
          tags: ['Mock']
        },
        {
          _id: 'mock-2',
          title: 'Mock Blog Post 2',
          slug: { current: 'mock-post-2' },
          mainImage: null,
          publishedAt: new Date().toISOString(),
          excerpt: 'Another mock post for development',
          author: 'Development Team',
          categories: ['Testing'],
          tags: ['Mock']
        }
      ];
    }
    
    // In production, return empty array but log the error
    return [];
  }
}

// Helper function to fetch a single blog post by slug with better error handling
export async function getBlogPostBySlug(slug: string, preview = false) {
  console.log('Fetching blog post with slug:', slug);
  
  try {
    const currentClient = getClient(preview);
    const post = await currentClient.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });
    return post;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

// Helper function to fetch all tags
export async function getAllTags() {
  try {
    const tags = await client.fetch(`*[_type == "tag"] {
      _id,
      title,
      "name": title,
      "count": count(*[_type == "post" && references(^._id)])
    } | order(count desc)`);
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}
