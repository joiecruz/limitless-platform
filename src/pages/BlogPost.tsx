
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { useEffect } from "react";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogMeta } from "@/components/blog/BlogMeta";
import { BlogContent } from "@/components/blog/BlogContent";
import { BlogNotFound } from "@/components/blog/BlogNotFound";
import { BlogLoading } from "@/components/blog/BlogLoading";
import { useToast } from "@/hooks/use-toast";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";

export default function BlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();
  
  // Ensure we start at the top of the page when navigating to a blog post
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Fetch the blog post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        console.error("Error loading blog post:", error);
        toast({
          title: "Error loading blog post",
          description: "Unable to load the blog post. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error("Error loading blog post:", error);
    }
  }, [error]);
  
  // Calculate read time based on word count
  const wordCount = post ? (post.content ? post.content.split(/\s+/).length : 0) : 0;
  const readTime = Math.ceil(wordCount / 200);
  
  // Base URL for canonical and OpenGraph
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/blog/${slug}`;
  
  // Default image to use when post image is not available
  const defaultImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  
  // Log debugging info
  useEffect(() => {
    console.log("Blog Post Debug Info:");
    console.log("- URL:", canonicalUrl);
    console.log("- Slug:", slug);
    console.log("- Post loaded:", !!post);
    console.log("- Image:", post?.cover_image || defaultImage);
  }, [canonicalUrl, slug, post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <OpenGraphTags 
          title="Loading Blog Post | Limitless Lab"
          description="Loading blog post from Limitless Lab"
          imageUrl={defaultImage}
          url={canonicalUrl}
          type="article"
        />
        <BlogLoading />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <OpenGraphTags 
          title="Blog Post Not Found | Limitless Lab"
          description="The blog post you're looking for couldn't be found."
          imageUrl={defaultImage}
          url={canonicalUrl}
          type="article"
        />
        <BlogNotFound />
      </div>
    );
  }

  // Metadata for the current post
  const metaTitle = `${post.title} | Limitless Lab Blog`;
  const metaDescription = (post.excerpt || `${post.title} - Limitless Lab Blog`).substring(0, 160);
  const ogImage = post.cover_image || defaultImage;

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags 
        title={metaTitle}
        description={metaDescription}
        imageUrl={ogImage}
        url={canonicalUrl}
        type="article"
        publishedTime={post.created_at}
      />
      
      <MainNav />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <BlogHeader title={post.title} coverImage={post.cover_image} />
        
        <BlogMeta 
          createdAt={post.created_at} 
          readTime={readTime} 
          categories={post.categories} 
        />
        
        <BlogContent content={post.content} />
      </article>

      <CTASection />
      <Footer />
    </div>
  );
}
