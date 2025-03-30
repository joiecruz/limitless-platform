
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration constants
const SANITY_PROJECT_ID = '42h9veeb';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2021-10-21';
const SANITY_TOKEN = 'skiDdn7nX4ZdoPx4Sl0kg4uAvAGSgpb9mdFKS2KwfrvffzzYT0eULAPhOJ9oXVUzGzPYIwP0bsA1SW0ZmIjKgqjiGCVV7s8iii1gLTZncg1zu7izaXlfV797uymPZTsqsNdsA6WUtHDv4wVf0Cj0U04qIxgO01DXnnpuSUfoQxCJuReVUb6y';

// FALLBACK_IMAGE used when mainImage is null or fails to load
export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=450";

// Create two clients - one with CDN for faster delivery, one without for more reliable direct connections
export const cdnClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true, // Enable CDN for faster initial loads
  token: SANITY_TOKEN,
  perspective: 'published',
});

export const directClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false, // Disable CDN for more reliable direct connections
  token: SANITY_TOKEN,
  perspective: 'published',
  timeout: 15, // Shorter timeout for quicker fallback
});

// Always start with the client for default operations
export const client = cdnClient;

// Set up image URL builder with more robust error handling
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  // Handle null source gracefully
  if (!source) {
    console.warn('Attempted to resolve image URL from null source - using fallback image');
    return {
      url: () => FALLBACK_IMAGE,
      width: () => ({ height: () => ({ url: () => FALLBACK_IMAGE }) }),
    };
  }
  
  try {
    return builder.image(source);
  } catch (error) {
    console.error('Error building image URL:', error);
    // Return a fallback function that mimics the imageUrlBuilder interface
    return {
      url: () => FALLBACK_IMAGE,
      width: () => ({ height: () => ({ url: () => FALLBACK_IMAGE }) }),
    };
  }
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

// Helper function to fetch blog posts with enhanced error handling and multiple retry strategies
export async function getBlogPosts(preview = false) {
  console.log('Fetching blog posts...');
  
  // Define the query once to reuse it
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    categories[]->{name},
    tags[]->{title}
  }`;
  
  try {
    // First attempt: try with CDN for faster response
    console.log('Trying to fetch with CDN...');
    const posts = await cdnClient.fetch(query);
    console.log(`Successfully fetched ${posts?.length || 0} blog posts from Sanity (CDN)`);
    return posts;
  } catch (cdnError) {
    console.warn('CDN fetch failed, trying direct API:', cdnError);
    
    try {
      // Second attempt: try direct API connection
      console.log('Trying direct API connection...');
      const posts = await directClient.fetch(query, {}, { timeout: 8000 });
      console.log(`Successfully fetched ${posts?.length || 0} blog posts from Sanity (direct)`);
      return posts;
    } catch (directError) {
      console.error('All Sanity fetch attempts failed:', directError);
      
      // Return mock data as fallback
      console.log('Using fallback mock blog data');
      return MOCK_BLOG_POSTS;
    }
  }
}

// Helper function to fetch a single blog post by slug with better error handling
export async function getBlogPostBySlug(slug: string, preview = false) {
  console.log('Fetching blog post with slug:', slug);
  
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    body,
    "author": author->name,
    "categories": categories[]->name,
    "tags": tags[]->title,
    "relatedPosts": *[_type == "post" && slug.current != $slug][0...3] {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt
    }
  }`;
  
  try {
    // First attempt: try with CDN
    const post = await cdnClient.fetch(query, { slug });
    return post;
  } catch (cdnError) {
    console.warn('CDN fetch failed for post slug, trying direct API:', cdnError);
    
    try {
      // Second attempt: try direct API connection
      const post = await directClient.fetch(query, { slug }, { timeout: 8000 });
      return post;
    } catch (directError) {
      console.error('All Sanity fetch attempts failed for post slug:', directError);
      
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
          author: 'Demo Author',
          relatedPosts: MOCK_BLOG_POSTS.filter(p => p._id !== mockPost._id)
        };
      }
      
      return null;
    }
  }
}

// Helper function to fetch all tags with better error handling
export async function getAllTags() {
  try {
    // First attempt with CDN
    const tags = await cdnClient.fetch(`*[_type == "tag"] {
      _id,
      title,
      "name": title,
      "count": count(*[_type == "post" && references(^._id)])
    } | order(count desc)`);
    return tags;
  } catch (cdnError) {
    console.warn('CDN fetch failed for tags, trying direct API:', cdnError);
    
    try {
      // Second attempt with direct API
      const tags = await directClient.fetch(`*[_type == "tag"] {
        _id,
        title,
        "name": title,
        "count": count(*[_type == "post" && references(^._id)])
      } | order(count desc)`);
      return tags;
    } catch (directError) {
      console.error('All Sanity fetch attempts failed for tags:', directError);
      return [
        { _id: 'mock-tag-1', title: 'React', name: 'React', count: 5 },
        { _id: 'mock-tag-2', title: 'Design', name: 'Design', count: 4 },
        { _id: 'mock-tag-3', title: 'JavaScript', name: 'JavaScript', count: 3 }
      ];
    }
  }
}
