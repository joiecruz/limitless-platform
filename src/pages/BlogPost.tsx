
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
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";

export default function BlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();
  
  // Log the slug value to help with debugging
  useEffect(() => {
    console.log("Blog post slug:", slug);
  }, [slug]);

  // Scroll to top when the component mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      console.log("Fetching blog post with slug:", slug);
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
      
      console.log("Blog post data:", data);
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
  
  // Define all variables outside conditional rendering blocks
  const canonicalUrl = `${window.location.origin}/blog/${slug}`;
  
  // Define meta data variables based on post availability
  const metaTitle = post ? `${post.title} | Limitless Lab Blog` : "Loading Blog Post | Limitless Lab";
  const metaDescription = post 
    ? (post.excerpt || post.meta_description || `${post.title} - Limitless Lab Blog`).substring(0, 160) 
    : "Loading blog post from Limitless Lab";
  
  const defaultImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  const ogImage = post?.cover_image || defaultImage;
  
  // Calculate read time
  const wordCount = post ? (post.content ? post.content.split(/\s+/).length : 0) : 0;
  const readTime = Math.ceil(wordCount / 200);
  
  // Debug OpenGraph tags
  useEffect(() => {
    console.log("Current URL:", window.location.href);
    console.log("Setting blog OpenGraph tags for:", slug);
    console.log("- Title:", metaTitle);
    console.log("- Description:", metaDescription);
    console.log("- Image:", ogImage);
    console.log("- URL:", canonicalUrl);
    
    // Force checking what's actually in the document
    setTimeout(() => {
      const ogTags = {
        title: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
        description: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
        image: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
        url: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
        type: document.querySelector('meta[property="og:type"]')?.getAttribute('content'),
      };
      
      console.log("DOCUMENT HEAD CONTAINS THESE OG TAGS:", ogTags);
    }, 1000);
  }, [slug, metaTitle, metaDescription, ogImage, canonicalUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Helmet prioritizeSeoTags={true}>
          <title>Loading Blog Post | Limitless Lab</title>
          <meta name="description" content="Loading blog post from Limitless Lab" />
          <link rel="canonical" href={canonicalUrl} />
          
          {/* OpenGraph tags for social sharing */}
          <meta property="og:title" content="Loading Blog Post | Limitless Lab" />
          <meta property="og:description" content="Loading blog post from Limitless Lab" />
          <meta property="og:image" content={defaultImage} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:site_name" content="Limitless Lab" />
          
          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Loading Blog Post | Limitless Lab" />
          <meta name="twitter:description" content="Loading blog post from Limitless Lab" />
          <meta name="twitter:image" content={defaultImage} />
        </Helmet>
        <BlogLoading />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Helmet prioritizeSeoTags={true}>
          <title>Blog Post Not Found | Limitless Lab</title>
          <meta name="description" content="The blog post you're looking for couldn't be found." />
          <link rel="canonical" href={canonicalUrl} />
          
          {/* OpenGraph tags for social sharing */}
          <meta property="og:title" content="Blog Post Not Found | Limitless Lab" />
          <meta property="og:description" content="The blog post you're looking for couldn't be found." />
          <meta property="og:image" content={defaultImage} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:site_name" content="Limitless Lab" />
          
          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Blog Post Not Found | Limitless Lab" />
          <meta name="twitter:description" content="The blog post you're looking for couldn't be found." />
          <meta name="twitter:image" content={defaultImage} />
        </Helmet>
        <BlogNotFound />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet prioritizeSeoTags={true}>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Force override any existing tags with these explicit OpenGraph tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Limitless Lab" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:published_time" content={post.created_at} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      
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
