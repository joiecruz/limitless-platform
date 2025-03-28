
import { useStructuredData } from "./useStructuredData";

interface UseSEOStructuredDataProps {
  type: 'website' | 'article';
  title: string;
  description: string;
  image: string;
  url: string;
  published?: string;
  modified?: string;
}

/**
 * A hook that manages structured data for SEO
 */
export function useSEOStructuredData({
  type,
  title,
  description,
  image,
  url,
  published,
  modified
}: UseSEOStructuredDataProps) {
  // Generate structured data based on page type
  const structuredData = type === 'article' 
    ? {
        headline: title,
        description,
        image,
        url,
        datePublished: published || new Date().toISOString(),
        dateModified: modified || new Date().toISOString(),
        author: {
          "@type": "Organization",
          "name": "Limitless Lab"
        },
        publisher: {
          "@type": "Organization",
          "name": "Limitless Lab",
          "logo": {
            "@type": "ImageObject",
            "url": "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png"
          }
        }
      }
    : {
        name: "Limitless Lab",
        description,
        url,
        image
      };
  
  // Apply structured data
  useStructuredData({
    type: type === 'article' ? 'Article' : 'WebPage',
    data: structuredData
  });
  
  return null;
}
