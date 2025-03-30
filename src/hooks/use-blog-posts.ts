
import { useQuery } from '@tanstack/react-query';
import { getBlogPosts, getBlogPostBySlug, getAllTags } from '@/lib/sanity';

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
  excerpt?: string;
  body?: any;
  author?: string;
  categories?: string[];
  tags?: string[];
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
      console.log('Executing useBlogPosts queryFn with preview:', preview);
      
      try {
        // Adding network check
        if (!navigator.onLine) {
          console.log('Network appears to be offline');
          throw new Error('Network offline. Please check your internet connection.');
        }
        
        const posts = await getBlogPosts(preview);
        
        if (!posts || posts.length === 0) {
          console.log('No blog posts returned from Sanity');
        } else {
          console.log(`Successfully fetched ${posts.length} blog posts`);
        }
        
        return posts;
      } catch (error) {
        console.error('Error in useBlogPosts queryFn:', error);
        throw error; // Rethrow to let React Query handle it
      }
    },
    retry: 2, // Increase retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
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
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: getAllTags,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
