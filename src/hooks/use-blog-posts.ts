
import { useQuery } from '@tanstack/react-query';
import { getBlogPosts, getBlogPostBySlug, getAllTags } from '@/lib/sanity';

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
  excerpt: string;
  body: any;
  author: string;
  categories: string[];
  tags: string[];
  relatedPosts?: BlogPost[];
}

export interface BlogTag {
  _id: string;
  title: string;
  name: string;
  count: number;
}

export function useBlogPosts(preview = false) {
  return useQuery({
    queryKey: ['blog-posts', preview],
    queryFn: async () => {
      console.log('Executing useBlogPosts queryFn');
      try {
        const posts = await getBlogPosts(preview);
        
        // Better logging for debugging
        if (!posts || posts.length === 0) {
          console.log('No blog posts returned from Sanity');
          console.log('Check Sanity Studio to ensure posts exist with _type="post"');
        } else {
          console.log(`Successfully fetched ${posts.length} blog posts`);
          console.log('First post title:', posts[0]?.title);
        }
        
        return posts;
      } catch (error) {
        console.error('Error in useBlogPosts queryFn:', error);
        throw error; // Rethrow to let React Query handle it
      }
    },
    retry: 1, // Reduce retry attempts for faster feedback during debugging
    retryDelay: 1000, // Simple 1 second delay between retries
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function useBlogPost(slug: string, preview = false) {
  return useQuery({
    queryKey: ['blog-post', slug, preview],
    queryFn: () => getBlogPostBySlug(slug, preview),
    enabled: !!slug,
    retry: 1, // Reduce retry attempts for faster feedback
    retryDelay: 1000,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: getAllTags,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
