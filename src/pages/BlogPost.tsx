
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

export default function BlogPost() {
  const { slug } = useParams();
  
  // Scroll to top when the component mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle error state
  useEffect(() => {
    if (error) {
      console.error("Error loading blog post:", error);
    }
  }, [error]);
  
  if (isLoading) {
    return <BlogLoading />;
  }

  if (!post) {
    return <BlogNotFound />;
  }

  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-white">
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
