
import { usePageSEO } from "@/hooks/usePageSEO";
import { useSEOEffect } from "@/hooks/useSEOEffect";
import { useSEOStructuredData } from "@/hooks/useSEOStructuredData";
import { SEOHelmet } from "./SEOHelmet";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
  published?: string;
  modified?: string;
  tags?: string[];
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * SEO component for managing meta tags
 */
export function SEO({
  title,
  description = "Transform your innovation journey with Limitless Lab's comprehensive platform for learning, tools, and community.",
  image = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png",
  canonical,
  type = "website",
  published,
  modified,
  tags,
  imageWidth = 1200,
  imageHeight = 630
}: SEOProps) {
  // Ensure title has the brand name
  const fullTitle = title.includes("Limitless Lab") 
    ? title 
    : `${title} | Limitless Lab`;
  
  // Use current URL as canonical if not provided
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Force update meta tags using our enhanced hook
  usePageSEO({
    title: fullTitle,
    description,
    imageUrl: image,
    canonicalUrl,
    type,
    published,
    modified,
    tags,
    imageWidth,
    imageHeight
  });

  // Handle SEO-related side effects
  useSEOEffect({
    title: fullTitle,
    description,
    image,
    canonical: canonicalUrl,
  });

  // Apply structured data
  useSEOStructuredData({
    type,
    title: fullTitle,
    description,
    image,
    url: canonicalUrl,
    published,
    modified
  });

  // The Helmet component manages document head tags
  return (
    <SEOHelmet
      title={fullTitle}
      description={description}
      image={image}
      canonical={canonicalUrl}
      type={type}
      published={published}
      modified={modified}
      tags={tags}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
    />
  );
}
