
import { useEffect } from "react";

interface UseToolsPageSEOProps {
  title: string;
  description: string;
  imageUrl: string;
  canonicalUrl: string;
}

/**
 * A hook that forces SEO meta tags to update for Tools pages
 * Helps solve issues with meta tags not updating properly in SPAs
 */
export function useToolsPageSEO({ 
  title, 
  description, 
  imageUrl, 
  canonicalUrl 
}: UseToolsPageSEOProps) {
  
  useEffect(() => {
    // Create a function to update meta tags
    const updateMetaTags = () => {
      // Basic meta tags
      document.title = title;
      
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
      setMetaContent('meta[name="twitter:title"]', title);
      setMetaContent('meta[name="twitter:description"]', description);
      setMetaContent('meta[name="twitter:image"]', imageWithTimestamp);
      
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
      
      console.log('Forced meta tag update for Tools page:', {
        title,
        description,
        image: imageWithTimestamp,
        canonical: canonicalUrl
      });
    };
    
    // Call immediately and after a delay to ensure React has updated the DOM
    updateMetaTags();
    const timeoutId = setTimeout(updateMetaTags, 300);
    
    return () => clearTimeout(timeoutId);
  }, [title, description, imageUrl, canonicalUrl]);
  
  // No need to return anything
  return null;
}
