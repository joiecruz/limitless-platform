
import { useMetaTags } from "./useMetaTags";
import { useMetaTagCleanup } from "./useMetaTagCleanup";
import { useInlineStructuredData } from "./useInlineStructuredData";
import { useSPAMetaUpdater } from "./useSPAMetaUpdater";

interface UsePageSEOProps {
  title: string;
  description: string;
  imageUrl: string;
  canonicalUrl: string;
  type?: 'website' | 'article';
  published?: string;
  modified?: string;
  tags?: string[];
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * A universal hook that orchestrates SEO meta tags to update for all pages
 * Delegates to more specialized hooks for better maintainability
 */
export function usePageSEO(props: UsePageSEOProps) {
  // Clean up any duplicate meta tags first
  useMetaTagCleanup();
  
  // Apply all meta tags
  useMetaTags(props);
  
  // Add structured data based on page type
  useInlineStructuredData({
    type: props.type === 'article' ? 'Article' : 'WebPage',
    title: props.title,
    description: props.description,
    imageUrl: props.imageUrl,
    canonicalUrl: props.canonicalUrl,
    published: props.published,
    modified: props.modified
  });
  
  // Ensure meta tags are updated during SPA navigation
  useSPAMetaUpdater({
    imageUrl: props.imageUrl,
    canonicalUrl: props.canonicalUrl
  });
  
  // This hook is used for its side effects only
  return null;
}
