
import { usePageSEO } from "./usePageSEO";

interface UseToolsPageSEOProps {
  title: string;
  description: string;
  imageUrl: string;
  canonicalUrl: string;
}

/**
 * A hook that forces SEO meta tags to update for Tools pages
 * Now uses the more general usePageSEO hook internally
 */
export function useToolsPageSEO({ 
  title, 
  description, 
  imageUrl, 
  canonicalUrl 
}: UseToolsPageSEOProps) {
  
  // Use the universal SEO hook with tools-specific defaults
  return usePageSEO({ 
    title, 
    description, 
    imageUrl, 
    canonicalUrl,
    type: 'website'
  });
}
