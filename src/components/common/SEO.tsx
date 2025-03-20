import { Helmet } from "react-helmet";
import { useEffect, useRef } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
  published?: string;
  modified?: string;
  tags?: string[];
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
    tags
  });

  // Force a new cache version in image URL to prevent social media caching
  const currentDate = new Date().toISOString().split('T')[0]; // Use date only: YYYY-MM-DD
  const imageWithCacheBuster = image.includes('?') 
    ? `${image}&_t=${currentDate}` 
    : `${image}?_t=${currentDate}`;

  // Set up cleanup function for meta tags and tracking
  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true;
    
    // Log for debugging
    console.log('SEO Component - Applying meta tags for:', {
      title: fullTitle,
      description,
      image: imageWithCacheBuster,
      url: canonicalUrl,
      type
    });

    // This function helps create a meta tag if it doesn't exist or update it if it does
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      if (!isMounted.current) return;
      
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Update document title
    if (isMounted.current) {
      document.title = fullTitle;
    }
    
    // Set all meta tags
    setMetaTag('description', description);
    setMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate');
    setMetaTag('Pragma', 'no-cache');
    setMetaTag('Expires', '0');
    
    // Open Graph meta tags
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', imageWithCacheBuster, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', 'Limitless Lab', true);
    
    // Twitter meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', imageWithCacheBuster);
    setMetaTag('twitter:url', canonicalUrl);
    
    // Create canonical link
    if (isMounted.current) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }
    
    // Article-specific meta tags
    if (type === 'article') {
      if (published) {
        setMetaTag('article:published_time', published, true);
      }
      if (modified) {
        setMetaTag('article:modified_time', modified, true);
      }
      if (tags && tags.length > 0) {
        // Remove old article tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => {
          if (isMounted.current) {
            el.parentNode?.removeChild(el);
          }
        });
        
        // Add new article tags
        tags.forEach(tag => {
          if (isMounted.current) {
            const tagMeta = document.createElement('meta');
            tagMeta.setAttribute('property', 'article:tag');
            tagMeta.setAttribute('content', tag);
            document.head.appendChild(tagMeta);
          }
        });
      }
    }
    
    // Clean up function to run when component unmounts
    return () => {
      isMounted.current = false;
      console.log('SEO Component - Cleaning up meta tags for:', fullTitle);
    };
  }, [fullTitle, description, imageWithCacheBuster, canonicalUrl, type, published, modified, tags]);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="0" />
      
      <link rel="preconnect" href="https://crllgygjuqpluvdpwayi.supabase.co" />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageWithCacheBuster} />
      <meta property="og:site_name" content="Limitless Lab" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageWithCacheBuster} />
      <meta name="twitter:url" content={canonicalUrl} />
      
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
