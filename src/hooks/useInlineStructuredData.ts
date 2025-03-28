
import { useEffect } from "react";

interface UseInlineStructuredDataProps {
  type: 'WebPage' | 'Article' | 'Organization';
  title: string;
  description: string;
  imageUrl: string;
  canonicalUrl: string;
  published?: string;
  modified?: string;
}

/**
 * Hook for adding structured data JSON-LD inline to the page
 */
export function useInlineStructuredData({
  type,
  title,
  description,
  imageUrl,
  canonicalUrl,
  published,
  modified
}: UseInlineStructuredDataProps) {
  useEffect(() => {
    // Base structured data with required fields
    const structuredData: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": type,
      "headline": title,
      "description": description,
      "image": imageUrl,
      "url": canonicalUrl,
    };
    
    // Add additional fields based on type
    if (type === 'Article') {
      structuredData.datePublished = published || new Date().toISOString();
      structuredData.dateModified = modified || new Date().toISOString();
      structuredData.publisher = {
        "@type": "Organization",
        "name": "Limitless Lab",
        "logo": {
          "@type": "ImageObject",
          "url": "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png"
        }
      };
    }

    // Add or update JSON-LD structured data
    let scriptTag = document.querySelector('#structured-data-script');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data-script';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
    
    return () => {
      // Clean up is optional as the script will be replaced on next render
    };
  }, [type, title, description, imageUrl, canonicalUrl, published, modified]);
  
  return null;
}
