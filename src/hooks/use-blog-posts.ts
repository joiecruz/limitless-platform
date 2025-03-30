
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
        console.log('Fetching blog posts via React Query...');
        const posts = await getBlogPosts(preview);
        if (!posts || posts.length === 0) {
          console.warn('No posts returned from Sanity');
        }
        return posts;
      } catch (error) {
        console.error('Error in useBlogPosts:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useBlogPost(slug: string, preview = false) {
  return useQuery({
    queryKey: ['blog-post', slug, preview],
    queryFn: async () => {
      try {
        console.log(`Fetching blog post with slug: ${slug}`);
        const post = await getBlogPostBySlug(slug, preview);
        // Handle null image case
        if (post && !post.mainImage) {
          console.log(`Post ${slug} has no mainImage, using null`);
        }
        return post;
      } catch (error) {
        console.error(`Error fetching blog post ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      try {
        const tags = await getAllTags();
        return tags;
      } catch (error) {
        console.error('Error fetching blog tags:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
