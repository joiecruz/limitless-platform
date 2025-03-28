
import { Helmet } from "react-helmet";
import { useEffect, useRef } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useStructuredData } from "@/hooks/useStructuredData";

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
  // Track mounted state to prevent memory leaks
  const isMounted = useRef(true);
  
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

  // Generate structured data based on page type
  const structuredData = type === 'article' 
    ? {
        headline: title,
        description,
        image,
        url: canonicalUrl,
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
        url: canonicalUrl,
        image
      };
  
  // Apply structured data
  useStructuredData({
    type: type === 'article' ? 'Article' : 'WebPage',
    data: structuredData
  });

  // Log for debugging
  useEffect(() => {
    console.log('SEO Component Initialized for:', {
      title: fullTitle,
      description,
      image,
      url: canonicalUrl,
      type
    });
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [fullTitle, description, image, canonicalUrl, type]);

  // Force meta refresh on route change
  useEffect(() => {
    // This helps with SPA routing issues where meta tags don't update
    const refreshMetaTags = () => {
      if (!isMounted.current) return;
      
      // Add timestamp to image URLs to bust cache
      const timestamp = new Date().getTime() + Math.random().toString(36).substring(2);
      
      document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((el) => {
        const content = el.getAttribute('content') || '';
        if (content) {
          const newContent = content.includes('?') 
            ? content.split('?')[0] + `?_t=${timestamp}` 
            : content + `?_t=${timestamp}`;
          el.setAttribute('content', newContent);
        }
      });
      
      // Make sure canonical URLs are correct
      document.querySelectorAll('meta[property="og:url"], meta[name="twitter:url"]').forEach((el) => {
        el.setAttribute('content', canonicalUrl);
      });
      
      console.log('Meta tags refreshed after navigation');
    };
    
    // Set up navigation observation for SPAs
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', refreshMetaTags);
      
      // For modern browsers with Navigation API
      if ('navigation' in window) {
        // @ts-ignore - Navigation API might not be fully typed
        window.navigation?.addEventListener('navigate', refreshMetaTags);
      }
    }
    
    // Force an initial refresh
    refreshMetaTags();
    
    // Set additional timeouts to handle delayed rendering
    const timeouts = [
      setTimeout(refreshMetaTags, 500),
      setTimeout(refreshMetaTags, 1500)
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('popstate', refreshMetaTags);
      if ('navigation' in window) {
        // @ts-ignore
        window.navigation?.removeEventListener('navigate', refreshMetaTags);
      }
    };
  }, [canonicalUrl]);

  // The Helmet component manages document head tags
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Force cache busting */}
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="-1" />
      
      {/* Performance optimization */}
      <link rel="preconnect" href="https://crllgygjuqpluvdpwayi.supabase.co" />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={imageWidth.toString()} />
      <meta property="og:image:height" content={imageHeight.toString()} />
      <meta property="og:site_name" content="Limitless Lab" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={canonicalUrl} />
      
      {/* Article-specific meta tags */}
      {type === 'article' && published && (
        <meta property="article:published_time" content={published} />
      )}
      {type === 'article' && modified && (
        <meta property="article:modified_time" content={modified} />
      )}
      {type === 'article' && tags && tags.map((tag) => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}
    </Helmet>
  );
}
