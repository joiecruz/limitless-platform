
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
      try {
        console.log('Fetching blog posts...');
        const posts = await getBlogPosts(preview);
        return posts;
      } catch (error) {
        console.error('Error in useBlogPosts:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function useBlogPost(slug: string, preview = false) {
  return useQuery({
    queryKey: ['blog-post', slug, preview],
    queryFn: () => getBlogPostBySlug(slug, preview),
    enabled: !!slug,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: getAllTags,
    retry: 1,
    retryDelay: 1000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
