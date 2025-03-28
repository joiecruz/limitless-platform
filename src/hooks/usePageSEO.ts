
import { useEffect } from "react";

interface UsePageSEOProps {
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
 * A universal hook that forces SEO meta tags to update for all pages
 * Optimized for social media crawler visibility and cache prevention
 */
export function usePageSEO({ 
  title, 
  description, 
  imageUrl, 
  canonicalUrl,
  type = 'website',
  published,
  modified,
  tags
}: UsePageSEOProps) {
  
  useEffect(() => {
    // Generate a truly unique timestamp for cache busting
    const uniqueTimestamp = new Date().getTime() + Math.random().toString(36).substring(2, 15);
    
    // Add cache buster to image URL - this is critical for social media platforms
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
    
    // Clean up existing meta tags to avoid duplicates
    const cleanup = () => {
      // Remove duplicate OG tags
      const ogTags = document.querySelectorAll('meta[property^="og:"]');
      const ogTagMap = new Map();
      
      ogTags.forEach(tag => {
        const prop = tag.getAttribute('property');
        if (prop && ogTagMap.has(prop)) {
          tag.parentNode?.removeChild(tag);
        } else if (prop) {
          ogTagMap.set(prop, tag);
        }
      });
      
      // Remove duplicate Twitter tags
      const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
      const twitterTagMap = new Map();
      
      twitterTags.forEach(tag => {
        const name = tag.getAttribute('name');
        if (name && twitterTagMap.has(name)) {
          tag.parentNode?.removeChild(tag);
        } else if (name) {
          twitterTagMap.set(name, tag);
        }
      });
    };
    
    // Execute cleanup first to avoid duplicate tags
    cleanup();
    
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
    
    // Dynamic structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? "Article" : "WebPage",
      "headline": title,
      "description": description,
      "image": imageWithTimestamp,
      "url": canonicalUrl,
      "datePublished": published || new Date().toISOString(),
      "dateModified": modified || new Date().toISOString(),
      "publisher": {
        "@type": "Organization",
        "name": "Limitless Lab",
        "logo": {
          "@type": "ImageObject",
          "url": "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png"
        }
      }
    };

    // Add or update JSON-LD structured data
    let scriptTag = document.querySelector('#structured-data-script');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data-script';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
    
    // Create or update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
    
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
    
    // Debugging information
    console.log('SEO meta tags applied for:', {
      title,
      description,
      image: imageWithTimestamp,
      url: canonicalUrl,
      type
    });
    
    // Force multiple updates to ensure crawlers don't miss tags
    // This ensures meta tags are properly set even after React re-renders
    const timeouts = [
      setTimeout(() => cleanup(), 300),
      setTimeout(() => {
        setMetaTag('og:image', imageWithTimestamp, true);
        setMetaTag('twitter:image', imageWithTimestamp);
      }, 600),
      setTimeout(() => {
        setMetaTag('og:url', canonicalUrl, true);
        setMetaTag('twitter:url', canonicalUrl);
      }, 1200)
    ];
    
    return () => {
      timeouts.forEach(id => clearTimeout(id));
      console.log('SEO meta tags cleanup for:', title);
    };
  }, [title, description, imageUrl, canonicalUrl, type, published, modified, tags]);
  
  // This hook is used for its side effects only
  return null;
}
