
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { getBlogPostBySlug } from "@/integrations/sanity/blogService";
import { urlFor } from "@/integrations/sanity/client";

export default function BlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();
  
  // Ensure we start at the top of the page when navigating to a blog post
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Fetch the blog post data from Sanity
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => slug ? getBlogPostBySlug(slug) : Promise.reject('No slug provided'),
    enabled: !!slug,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error("Error loading blog post:", error);
      toast({
        title: "Error loading blog post",
        description: "Unable to load the blog post. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Base URL for canonical and OpenGraph
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/blog/${slug}`;
  
  // Default image to use when post image is not available
  const defaultImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  
  // Determine the image URL
  const postImageUrl = post?.mainImage ? urlFor(post.mainImage) : defaultImage;
  
  // Log debugging info
  useEffect(() => {
    console.log("Blog Post Debug Info:");
    console.log("- URL:", canonicalUrl);
    console.log("- Slug:", slug);
    console.log("- Post loaded:", !!post);
    console.log("- Image:", postImageUrl);
  }, [canonicalUrl, slug, post, postImageUrl]);

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

  // Extract categories from Sanity format
  const categories = post.categories ? post.categories.map(cat => cat.title) : [];

  // Metadata for the current post
  const metaTitle = `${post.title} | Limitless Lab Blog`;
  const metaDescription = (post.excerpt || post.meta_description || `${post.title} - Limitless Lab Blog`).substring(0, 160);

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags 
        title={metaTitle}
        description={metaDescription}
        imageUrl={postImageUrl}
        url={canonicalUrl}
        type="article"
        publishedTime={post.publishedAt}
      />
      
      <MainNav />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <BlogHeader title={post.title} coverImage={postImageUrl} />
        
        <BlogMeta 
          createdAt={post.publishedAt} 
          readTime={post.estimatedReadingTime || 5} 
          categories={categories} 
        />
        
        <BlogContent content={post.body} />
      </article>

      <CTASection />
      <Footer />
    </div>
  );
}
