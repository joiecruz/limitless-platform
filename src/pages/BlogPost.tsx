
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
  
  // Define default values outside of conditional rendering
  const defaultImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  const canonicalUrl = `${window.location.origin}/blog/${slug}`;
  
  // Always define these variables regardless of loading state
  const wordCount = post ? (post.content ? post.content.split(/\s+/).length : 0) : 0;
  const readTime = Math.ceil(wordCount / 200);
  
  // Prepare meta title and description regardless of post loading state
  const metaTitle = post ? `${post.title} | Limitless Lab Blog` : "Loading Blog Post | Limitless Lab";
  const metaDescription = post 
    ? (post.excerpt || post.meta_description || `${post.title} - Limitless Lab Blog`) 
    : "Loading blog post from Limitless Lab";
  const ogImage = post?.cover_image || defaultImage;

  // Debug OpenGraph tags - this hook should always be present
  useEffect(() => {
    console.log("Setting blog OpenGraph tags:");
    console.log("- Title:", metaTitle);
    console.log("- Description:", metaDescription);
    console.log("- Image:", ogImage);
    console.log("- URL:", canonicalUrl);
    
    // Debug what the document head contains
    const metaTags = document.querySelectorAll('meta');
    console.log("Current meta tags in document:");
    metaTags.forEach(tag => {
      console.log(`${tag.getAttribute('property') || tag.getAttribute('name')}: ${tag.getAttribute('content')}`);
    });
  }, [metaTitle, metaDescription, ogImage, canonicalUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Helmet prioritizeSeoTags>
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
        <Helmet prioritizeSeoTags>
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
      <Helmet prioritizeSeoTags>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* OpenGraph tags for social sharing */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Limitless Lab" />
        
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
