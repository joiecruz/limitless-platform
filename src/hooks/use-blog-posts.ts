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
    queryFn: () => getBlogPosts(preview),
  });
}

export function useBlogPost(slug: string, preview = false) {
  return useQuery({
    queryKey: ['blog-post', slug, preview],
    queryFn: () => getBlogPostBySlug(slug, preview),
    enabled: !!slug,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: getAllTags,
  });
} 