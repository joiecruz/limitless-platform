
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration constants
const SANITY_PROJECT_ID = '42h9veeb';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2021-10-21'; // Using an older, more stable API version
const SANITY_TOKEN = 'skiDdn7nX4ZdoPx4Sl0kg4uAvAGSgpb9mdFKS2KwfrvffzzYT0eULAPhOJ9oXVUzGzPYIwP0bsA1SW0ZmIjKgqjiGCVV7s8iii1gLTZncg1zu7izaXlfV797uymPZTsqsNdsA6WUtHDv4wVf0Cj0U04qIxgO01DXnnpuSUfoQxCJuReVUb6y';

// Create main client with a shorter timeout and no CDN for reliability
export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false, // Disable CDN for more reliable direct connections
  token: SANITY_TOKEN,
  timeout: 30, // Shorter timeout to fail faster
});

// Set up image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  // Handle null source to prevent errors
  if (!source) {
    console.warn('Attempted to resolve image URL from null source');
    return {
      url: () => 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=450',
      width: () => ({ height: () => ({ url: () => 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=450' }) }),
    };
  }
  return builder.image(source);
}

// Mock data for when Sanity connection fails
const MOCK_BLOG_POSTS = [
  {
    _id: 'mock-1',
    title: 'Building Responsive Web Applications',
    slug: { current: 'building-responsive-web-applications' },
    mainImage: null,
    publishedAt: new Date().toISOString(),
    excerpt: 'Learn how to create responsive web applications that work on any device.',
    categories: ['Development', 'Web Design'],
    tags: ['React', 'Responsive Design']
  },
  {
    _id: 'mock-2',
    title: 'Getting Started with UI Design',
    slug: { current: 'getting-started-with-ui-design' },
    mainImage: null,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    excerpt: 'A comprehensive guide to UI design principles for beginners.',
    categories: ['Design', 'UI/UX'],
    tags: ['Design', 'UI']
  },
  {
    _id: 'mock-3',
    title: 'Modern JavaScript Techniques',
    slug: { current: 'modern-javascript-techniques' },
    mainImage: null,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    excerpt: 'Discover modern JavaScript techniques to improve your code quality.',
    categories: ['Development', 'JavaScript'],
    tags: ['JavaScript', 'ES6']
  }
];

// Helper function to fetch blog posts with enhanced error handling
export async function getBlogPosts(preview = false) {
  console.log('Fetching blog posts from Sanity...');
  
  try {
    // First attempt: try the regular query
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      categories,
      tags
    }`;
    
    const posts = await client.fetch(query, {}, { timeout: 8000 });
    console.log(`Successfully fetched ${posts?.length || 0} blog posts from Sanity`);
    return posts;
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    
    // Return mock data when in development or as a fallback
    console.log('Using fallback mock blog data');
    return MOCK_BLOG_POSTS;
  }
}

// Helper function to fetch a single blog post by slug with better error handling
export async function getBlogPostBySlug(slug: string, preview = false) {
  console.log('Fetching blog post with slug:', slug);
  
  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      body,
      categories,
      tags,
      "relatedPosts": *[_type == "post" && slug.current != $slug][0...3] {
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt
      }
    }`;
    
    const post = await client.fetch(query, { slug }, { timeout: 8000 });
    return post;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    
    // If we're looking for a mock slug (for development), return mock data
    if (slug.startsWith('mock-') || slug.includes('building-responsive')) {
      const mockPost = MOCK_BLOG_POSTS.find(p => p.slug.current === slug) || MOCK_BLOG_POSTS[0];
      
      return {
        ...mockPost,
        body: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'This is mock content for the blog post. In a real scenario, this would be fetched from Sanity.'
              }
            ]
          }
        ],
        relatedPosts: MOCK_BLOG_POSTS.filter(p => p._id !== mockPost._id)
      };
    }
    
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
