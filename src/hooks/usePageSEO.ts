
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
 * Helps solve issues with meta tags not updating properly in SPAs and social media cache problems
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
    // Create a function to update meta tags
    const updateMetaTags = () => {
      // Basic meta tags
      document.title = title.includes("Limitless Lab") ? title : `${title} | Limitless Lab`;
      
      // Function to set meta tag content
      const setMetaContent = (selector: string, content: string, isProperty = false) => {
        const meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          const newMeta = document.createElement('meta');
          if (isProperty) {
            newMeta.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
          } else {
            newMeta.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
          }
          newMeta.setAttribute('content', content);
          document.head.appendChild(newMeta);
        }
      };
      
      // Add timestamp for cache busting
      const timestamp = new Date().toISOString();
      const imageWithTimestamp = imageUrl.includes('?') 
        ? `${imageUrl}&_t=${timestamp}` 
        : `${imageUrl}?_t=${timestamp}`;
      
      // Update meta tags
      setMetaContent('meta[name="description"]', description);
      setMetaContent('meta[property="og:title"]', title, true);
      setMetaContent('meta[property="og:description"]', description, true);
      setMetaContent('meta[property="og:image"]', imageWithTimestamp, true);
      setMetaContent('meta[property="og:url"]', canonicalUrl, true);
      setMetaContent('meta[property="og:type"]', type, true);
      setMetaContent('meta[name="twitter:title"]', title);
      setMetaContent('meta[name="twitter:description"]', description);
      setMetaContent('meta[name="twitter:image"]', imageWithTimestamp);
      
      // Set cache control headers
      setMetaContent('meta[http-equiv="Cache-Control"]', 'no-cache, no-store, must-revalidate', false);
      setMetaContent('meta[http-equiv="Pragma"]', 'no-cache', false);
      setMetaContent('meta[http-equiv="Expires"]', '0', false);
      
      // Article-specific meta tags
      if (type === 'article') {
        if (published) {
          setMetaContent('meta[property="article:published_time"]', published, true);
        }
        if (modified) {
          setMetaContent('meta[property="article:modified_time"]', modified, true);
        }
        if (tags && tags.length > 0) {
          // Remove old article tags
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
      
      // Update canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', canonicalUrl);
        document.head.appendChild(canonicalLink);
      }
      
      console.log('SEO meta tags force-updated for page:', {
        title,
        description,
        image: imageWithTimestamp,
        canonical: canonicalUrl,
        type
      });
    };
    
    // Call immediately and after a delay to ensure React has updated the DOM
    updateMetaTags();
    const timeoutId = setTimeout(updateMetaTags, 300);
    
    // Also schedule periodic updates to ensure meta tags are correct
    // This helps with single-page applications where meta tags can get overwritten
    const intervalId = setInterval(updateMetaTags, 2000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [title, description, imageUrl, canonicalUrl, type, published, modified, tags]);
  
  // No need to return anything as this is a side-effect hook
  return null;
}
