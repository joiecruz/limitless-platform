
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { format } from "date-fns";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/common/SEO";

export default function BlogPost() {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { data: post, isLoading } = useQuery({
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
    }
  });

  // Extract first paragraph text for meta description
  const getMetaDescription = (content: string | null | undefined): string => {
    if (!content) return '';
    
    try {
      // Remove any HTML tags and get clean text
      const cleanText = content.replace(/<[^>]*>/g, '');
      
      // Get first 2-3 sentences for description (better than just 160 characters)
      const sentences = cleanText.split(/[.!?]+/).filter(sentence => 
        sentence && sentence.trim().length > 0
      );
      
      let description = '';
      // Try to get 2-3 sentences depending on length
      if (sentences.length >= 2) {
        description = sentences.slice(0, sentences[0].length < 80 ? 3 : 2).join('. ').trim();
      } else {
        description = sentences[0] || '';
      }
      
      // Ensure it's not too long for meta description (120-160 chars is ideal)
      return description.length > 160 
        ? description.substring(0, 157) + '...' 
        : description;
    } catch (e) {
      console.error('Error extracting meta description:', e);
      return post?.meta_description || '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Prepare metadata values prioritizing custom meta description if available
  const title = post.title || "Blog Post";
  const description = post.meta_description || getMetaDescription(post.content);
  const imageUrl = post.cover_image || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/og-image.png";
  const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;

  // Add structured metadata for article
  useEffect(() => {
    if (post) {
      // Create JSON-LD structured data for the article
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": post.cover_image,
        "datePublished": post.created_at,
        "dateModified": post.updated_at,
        "author": {
          "@type": "Organization",
          "name": "Limitless Lab"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Limitless Lab",
          "logo": {
            "@type": "ImageObject",
            "url": "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png"
          }
        },
        "description": description
      };

      // Add structured data to the page
      let script = document.getElementById('article-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'article-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(articleSchema);

      // Clean up when component unmounts
      return () => {
        const scriptToRemove = document.getElementById('article-schema');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [post, description]);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={title}
        description={description}
        image={imageUrl}
        canonical={canonicalUrl}
        type="article"
        published={post.created_at}
        modified={post.updated_at}
        tags={post.categories}
      />
      
      <MainNav />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
          <time dateTime={post.created_at}>
            {format(new Date(post.created_at), 'MMMM d, yyyy')}
          </time>
          <span>·</span>
          <span>{readTime} min read</span>
          {post.categories && post.categories.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category: string) => (
                  <span
                    key={category}
                    className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
          {post.title}
        </h1>
        
        {post.cover_image && (
          <div className="aspect-video w-full mb-12 rounded-lg overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg mb-24"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <CTASection />
      <Footer />
    </div>
  );
}
