
import { useEffect, useRef } from "react";

interface UseSEOEffectProps {
  title: string;
  description: string;
  image: string;
  canonical: string;
}

/**
 * A hook that handles SEO-related side effects
 */
export function useSEOEffect({
  title,
  description,
  image,
  canonical
}: UseSEOEffectProps) {
  // Track mounted state to prevent memory leaks
  const isMounted = useRef(true);

  // Log for debugging
  useEffect(() => {
    console.log('SEO Effect Initialized for:', {
      title,
      description,
      image,
      url: canonical,
    });
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [title, description, image, canonical]);

  // Force meta refresh on route change
  useEffect(() => {
    // This helps with SPA routing issues where meta tags don't update
    const refreshMetaTags = () => {
      if (!isMounted.current) return;
      
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
        el.setAttribute('content', canonical);
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
  }, [canonical]);

  return null;
}
