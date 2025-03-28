
import { useEffect } from "react";

interface UseMetaTagsProps {
  title: string;
  description: string;
  imageUrl: string;
  canonicalUrl: string;
  type?: 'website' | 'article';
  published?: string;
  modified?: string;
  tags?: string[];
}

/**
 * Hook for managing meta tags in the document head
 */
export function useMetaTags({
  title,
  description,
  imageUrl,
  canonicalUrl,
  type = 'website',
  published,
  modified,
  tags
}: UseMetaTagsProps) {
  useEffect(() => {
    // Generate a unique timestamp for cache busting
    const uniqueTimestamp = new Date().getTime() + Math.random().toString(36).substring(2, 15);
    
    // Add cache buster to image URL - critical for social media platforms
    const imageWithTimestamp = imageUrl.includes('?') 
      ? `${imageUrl.split('?')[0]}?_t=${uniqueTimestamp}` 
      : `${imageUrl}?_t=${uniqueTimestamp}`;
    
    // Function to create or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Update document title
    document.title = title.includes("Limitless Lab") ? title : `${title} | Limitless Lab`;
    
    // Basic meta tags with strong cache prevention
    setMetaTag('description', description);
    setMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    setMetaTag('Pragma', 'no-cache');
    setMetaTag('Expires', '0');
    
    // Open Graph meta tags - critical for Facebook, LinkedIn, etc.
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', imageWithTimestamp, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', 'Limitless Lab', true);
    setMetaTag('og:updated_time', new Date().toISOString(), true);
    
    // Twitter meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', imageWithTimestamp);
    setMetaTag('twitter:url', canonicalUrl);
    
    // Article-specific meta tags
    if (type === 'article') {
      if (published) {
        setMetaTag('article:published_time', published, true);
      }
      if (modified) {
        setMetaTag('article:modified_time', modified, true);
      }
      if (tags && tags.length > 0) {
        // Remove old article tags first
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => {
          el.parentNode?.removeChild(el);
        });
        
        // Add new article tags
        tags.forEach(tag => {
          const tagMeta = document.createElement('meta');
          tagMeta.setAttribute('property', 'article:tag');
          tagMeta.setAttribute('content', tag);
          document.head.appendChild(tagMeta);
        });
      }
    }
    
    // Create or update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
    
    console.log('Meta tags applied for:', {
      title,
      description,
      image: imageWithTimestamp,
      url: canonicalUrl,
      type
    });
    
  }, [title, description, imageUrl, canonicalUrl, type, published, modified, tags]);
  
  return null;
}
