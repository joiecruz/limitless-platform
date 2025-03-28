
import { useEffect } from "react";

/**
 * Hook for debugging SEO issues
 * Add this to any page where SEO meta tags aren't working correctly
 */
export function useSEODebugger(pageName: string) {
  useEffect(() => {
    const logMetaTags = () => {
      console.group(`SEO Debug for ${pageName}`);
      
      // Log all meta tags
      const metaTags = document.querySelectorAll('meta');
      console.log(`Found ${metaTags.length} meta tags`);
      
      // Log OG tags
      const ogTags = document.querySelectorAll('meta[property^="og:"]');
      console.log(`Found ${ogTags.length} OpenGraph tags:`);
      ogTags.forEach(tag => {
        const prop = tag.getAttribute('property');
        const content = tag.getAttribute('content');
        console.log(`  ${prop}: ${content}`);
      });
      
      // Log Twitter tags
      const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
      console.log(`Found ${twitterTags.length} Twitter tags:`);
      twitterTags.forEach(tag => {
        const name = tag.getAttribute('name');
        const content = tag.getAttribute('content');
        console.log(`  ${name}: ${content}`);
      });
      
      // Log canonical
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      console.log(`Canonical: ${canonicalLink?.getAttribute('href')}`);
      
      console.groupEnd();
    };
    
    // Run immediately
    logMetaTags();
    
    // Run again after a delay to see if tags change
    const timeoutId = setTimeout(logMetaTags, 1000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pageName]);
  
  return null;
}
