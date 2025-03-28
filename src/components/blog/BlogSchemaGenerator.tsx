
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
    
    // Ensure image URL is absolute
    let imageUrl = post.cover_image || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/og-image.png";
    
    // Force https for image URLs
    if (imageUrl && imageUrl.startsWith('http:')) {
      imageUrl = imageUrl.replace('http:', 'https:');
    }
    
    // If URL is relative, make it absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = new URL(imageUrl, window.location.origin).toString();
    }
    
    // Add cache buster
    imageUrl = imageUrl.includes('?') 
      ? `${imageUrl.split('?')[0]}?_t=${timestamp}` 
      : `${imageUrl}?_t=${timestamp}`;
    
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
      "image": {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 630
      },
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
          "url": "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png",
          "width": 600,
          "height": 60
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
