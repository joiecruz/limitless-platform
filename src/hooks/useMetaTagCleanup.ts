
import { useEffect } from "react";

/**
 * Hook for cleaning up duplicate meta tags
 */
export function useMetaTagCleanup() {
  useEffect(() => {
    // Remove duplicate and static OG tags
    const cleanupOGTags = () => {
      // First, remove all static meta tags from index.html that might be interfering
      const defaultOgImage = document.querySelector('meta[property="og:image"][content^="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png"]');
      const defaultOgTitle = document.querySelector('meta[property="og:title"][content="Limitless Lab: All-in-One Innovation Platform"]');
      
      if (defaultOgImage && defaultOgImage.parentNode) {
        console.log("Removing default OG image meta tag");
        defaultOgImage.parentNode.removeChild(defaultOgImage);
      }
      
      if (defaultOgTitle && defaultOgTitle.parentNode) {
        console.log("Removing default OG title meta tag");
        defaultOgTitle.parentNode.removeChild(defaultOgTitle);
      }
      
      // Now handle any duplicates for remaining tags
      const ogTags = document.querySelectorAll('meta[property^="og:"]');
      const ogTagMap = new Map();
      
      ogTags.forEach(tag => {
        const prop = tag.getAttribute('property');
        if (prop && ogTagMap.has(prop)) {
          console.log(`Removing duplicate OG tag: ${prop}`);
          tag.parentNode?.removeChild(tag);
        } else if (prop) {
          ogTagMap.set(prop, tag);
        }
      });
    };
    
    // Remove duplicate Twitter tags
    const cleanupTwitterTags = () => {
      // First remove default tags
      const defaultTwitterImage = document.querySelector('meta[name="twitter:image"][content^="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png"]');
      const defaultTwitterTitle = document.querySelector('meta[name="twitter:title"][content="Limitless Lab: All-in-One Innovation Platform"]');
      
      if (defaultTwitterImage && defaultTwitterImage.parentNode) {
        console.log("Removing default Twitter image meta tag");
        defaultTwitterImage.parentNode.removeChild(defaultTwitterImage);
      }
      
      if (defaultTwitterTitle && defaultTwitterTitle.parentNode) {
        console.log("Removing default Twitter title meta tag");
        defaultTwitterTitle.parentNode.removeChild(defaultTwitterTitle);
      }
      
      // Now handle any duplicates
      const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
      const twitterTagMap = new Map();
      
      twitterTags.forEach(tag => {
        const name = tag.getAttribute('name');
        if (name && twitterTagMap.has(name)) {
          console.log(`Removing duplicate Twitter tag: ${name}`);
          tag.parentNode?.removeChild(tag);
        } else if (name) {
          twitterTagMap.set(name, tag);
        }
      });
    };
    
    // Execute cleanup
    const cleanup = () => {
      console.log("Running meta tag cleanup");
      cleanupOGTags();
      cleanupTwitterTags();
    };
    
    // Run cleanup on mount
    cleanup();
    
    // Run cleanup again after a short delay to catch any late additions
    const timeoutIds = [
      setTimeout(cleanup, 100),
      setTimeout(cleanup, 300),
      setTimeout(cleanup, 1000)
    ];
    
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);
  
  return null;
}
