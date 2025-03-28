
import { useEffect } from "react";
import { usePageSEO } from "./usePageSEO";

/**
 * Custom hook for Sign In page SEO
 */
export function useSignInPageSEO() {
  // Force meta tag override for sign-in page
  usePageSEO({
    title: "Sign in to Limitless Lab",
    description: "Sign in to access Limitless Lab's comprehensive platform for learning, tools, and community.",
    imageUrl: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png",
    canonicalUrl: `${window.location.origin}/signin`,
    type: 'website'
  });
  
  // Extra force-update of OG meta tags
  useEffect(() => {
    const forceUpdateMeta = () => {
      console.log("Force updating meta tags for sign-in page");
      
      // Generate unique timestamp
      const timestamp = Date.now().toString() + Math.random().toString(36).substring(2, 15);
      const imageUrl = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png";
      const imageWithTimestamp = `${imageUrl}?_t=${timestamp}`;
      
      // Directly set meta tags as a last resort
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', "Sign in to Limitless Lab");
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', "Sign in to access Limitless Lab's comprehensive platform for learning, tools, and community.");
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageWithTimestamp);
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${window.location.origin}/signin`);
      
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', "Sign in to Limitless Lab");
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', "Sign in to access Limitless Lab's comprehensive platform for learning, tools, and community.");
      document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageWithTimestamp);
    };
    
    // Execute immediately
    forceUpdateMeta();
    
    // Also execute after a small delay to ensure React has completed rendering
    const timeoutId = setTimeout(forceUpdateMeta, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  return null;
}
