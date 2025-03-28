
import { useEffect } from "react";

interface StructuredDataProps {
  type: 'Organization' | 'WebPage' | 'Article' | 'Product' | 'Event';
  data: Record<string, any>;
}

/**
 * A hook to manage structured data (JSON-LD) for SEO
 */
export function useStructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Base structured data with required fields
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };

    // Add or update JSON-LD structured data script
    let scriptTag = document.getElementById(`structured-data-${type.toLowerCase()}`);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = `structured-data-${type.toLowerCase()}`;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(structuredData);
    
    // Clean up function
    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [type, data]);
  
  // This hook is for side effects only
  return null;
}
