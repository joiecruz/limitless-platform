
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Use environment variables for Sanity config
export const SANITY_PROJECT_ID = '42h9veeb';
export const SANITY_DATASET = 'production';
export const SANITY_API_VERSION = '2021-10-21';
// Use without token for public data
export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=450";

// Create a client without token for public read-only access
export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false, // Disable CDN to avoid CORS issues
  perspective: 'published',
});

// Set up image URL builder with error handling
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
export const MOCK_BLOG_POSTS = [
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

// Helper function to fetch blog posts with better CORS handling
export async function getBlogPosts(preview = false) {
  console.log('Fetching blog posts...');
  
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
    console.log('Attempting to fetch from Sanity...');
    const posts = await client.fetch(query);
    console.log(`Successfully fetched ${posts?.length || 0} blog posts from Sanity`);
    return posts;
  } catch (error) {
    console.error('Failed to fetch from Sanity:', error);
    console.log('Using fallback mock blog data');
    
    // Show CORS-specific error information for debugging
    if (error instanceof Error && error.message.includes('CORS')) {
      console.error('CORS issue detected. Please add your domain to the CORS origins in Sanity Studio.');
      console.error('Go to https://limitless-lab.sanity.studio/desk and then Settings → API → CORS origins');
    }
    
    return MOCK_BLOG_POSTS;
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
    const post = await client.fetch(query, { slug });
    return post;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    
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

// Helper function to fetch all tags with better error handling
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
    console.error('Failed to fetch tags:', error);
    return [
      { _id: 'mock-tag-1', title: 'React', name: 'React', count: 5 },
      { _id: 'mock-tag-2', title: 'Design', name: 'Design', count: 4 },
      { _id: 'mock-tag-3', title: 'JavaScript', name: 'JavaScript', count: 3 }
    ];
  }
}
