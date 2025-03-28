
import { useEffect } from "react";

/**
 * Hook for cleaning up duplicate meta tags
 */
export function useMetaTagCleanup() {
  useEffect(() => {
    // Remove duplicate OG tags
    const cleanupOGTags = () => {
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
    };
    
    // Remove duplicate Twitter tags
    const cleanupTwitterTags = () => {
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
    
    // Execute cleanup
    const cleanup = () => {
      cleanupOGTags();
      cleanupTwitterTags();
    };
    
    // Run cleanup on mount
    cleanup();
    
    // Run cleanup again after a short delay to catch any late additions
    const timeoutId = setTimeout(cleanup, 300);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  return null;
}
