
import { useEffect } from "react";

interface BlogSchemaGeneratorProps {
  post: {
    title: string;
    cover_image?: string | null;
    created_at: string;
    updated_at: string;
    slug: string;
  };
  description: string;
}

export function BlogSchemaGenerator({ post, description }: BlogSchemaGeneratorProps) {
  useEffect(() => {
    if (!post) return;
    
    // Add unique cache-busting parameter to image URL
    const timestamp = Date.now().toString() + Math.random().toString(36).substring(2, 8);
    const imageUrl = post.cover_image 
      ? (post.cover_image.includes('?') 
          ? `${post.cover_image.split('?')[0]}?_t=${timestamp}` 
          : `${post.cover_image}?_t=${timestamp}`)
      : null;
    
    // Current canonical URL
    const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;
    
    // Create JSON-LD structured data for the article
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "headline": post.title,
      "image": imageUrl,
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
      script.setAttribute('type', 'application/ld+json');
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
  }, [post, description]);

  return null; // This component doesn't render anything
}
