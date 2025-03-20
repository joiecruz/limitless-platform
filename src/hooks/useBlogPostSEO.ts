
import { useMemo } from "react";
import { extractMetaDescription } from "@/components/blog/MetaDescriptionExtractor";

interface BlogPostData {
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  cover_image?: string | null;
  meta_description?: string | null;
  slug: string;
  categories?: string[] | null;
}

export function useBlogPostSEO(post: BlogPostData | null | undefined) {
  const seoData = useMemo(() => {
    if (!post) return null;
    
    // Calculate metadata values
    const title = post.title || "Blog Post";
    const description = post.meta_description || extractMetaDescription(post.content);
    const imageUrl = post.cover_image || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/og-image.png";
    const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;
    
    return {
      title,
      description,
      imageUrl,
      canonicalUrl,
      published: post.created_at,
      modified: post.updated_at,
      tags: post.categories
    };
  }, [post]);
  
  return seoData;
}
