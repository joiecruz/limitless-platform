
import { useEffect } from "react";

interface UseSPAMetaUpdaterProps {
  imageUrl: string;
  canonicalUrl: string;
}

/**
 * Hook to ensure meta tags are updated when SPA navigation occurs
 */
export function useSPAMetaUpdater({ imageUrl, canonicalUrl }: UseSPAMetaUpdaterProps) {
  useEffect(() => {
    const refreshMetaTags = () => {
      // Add timestamp to image URLs to bust cache
      const timestamp = new Date().getTime() + Math.random().toString(36).substring(2);
      
      document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((el) => {
        const content = el.getAttribute('content') || '';
        if (content) {
          const newContent = content.includes('?') 
            ? content.split('?')[0] + `?_t=${timestamp}` 
            : content + `?_t=${timestamp}`;
          el.setAttribute('content', newContent);
        }
      });
      
      // Make sure canonical URLs are correct
      document.querySelectorAll('meta[property="og:url"], meta[name="twitter:url"]').forEach((el) => {
        el.setAttribute('content', canonicalUrl);
      });
      
      console.log('Meta tags refreshed after navigation');
    };
    
    // Set up navigation observation for SPAs
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', refreshMetaTags);
      
      // For modern browsers with Navigation API
      if ('navigation' in window) {
        // @ts-ignore - Navigation API might not be fully typed
        window.navigation?.addEventListener('navigate', refreshMetaTags);
      }
    }
    
    // Force an initial refresh
    refreshMetaTags();
    
    // Set additional timeouts to handle delayed rendering
    const timeouts = [
      setTimeout(refreshMetaTags, 500),
      setTimeout(refreshMetaTags, 1500)
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('popstate', refreshMetaTags);
      if ('navigation' in window) {
        // @ts-ignore
        window.navigation?.removeEventListener('navigate', refreshMetaTags);
      }
    };
  }, [imageUrl, canonicalUrl]);
  
  return null;
}
