
import { Helmet } from "react-helmet";
import { useEffect } from "react";

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
  // Ensure title has the brand name
  const fullTitle = title.includes("Limitless Lab") 
    ? title 
    : `${title} | Limitless Lab`;
  
  // Use current URL as canonical if not provided
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Ensure image is an absolute URL
  const absoluteImage = image.startsWith('http') 
    ? image 
    : (typeof window !== 'undefined' ? `${window.location.origin}${image}` : image);

  // Update the document title and meta tags directly to ensure they're available for crawlers
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Set document title
      document.title = fullTitle;
      
      console.log('SEO Component updating meta tags for:', {
        title: fullTitle,
        description,
        image: absoluteImage,
        url: canonicalUrl,
        type
      });
      
      // Remove all existing meta tags that we're going to replace
      const removeMetaTags = (selector: string) => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.parentNode) {
            console.log('Removing meta tag:', el.outerHTML);
            el.parentNode.removeChild(el);
          }
        });
      };
      
      // Remove standard description and OG meta tags
      removeMetaTags('meta[name="description"]:not([data-rh="true"])');
      removeMetaTags('meta[property^="og:"]:not([data-rh="true"])');
      removeMetaTags('meta[name^="twitter:"]:not([data-rh="true"])');
      removeMetaTags('meta[property^="article:"]:not([data-rh="true"])');
      
      // Force a new cache version in image URL to help social media platforms refresh their cache
      const timeStamp = new Date().getTime();
      const imageWithCacheBuster = absoluteImage.includes('?') 
        ? `${absoluteImage}&_t=${timeStamp}` 
        : `${absoluteImage}?_t=${timeStamp}`;
        
      // Dynamically update Open Graph meta tags
      const updateOrCreateMetaTag = (name: string, content: string, isProperty = false) => {
        let meta = document.querySelector(isProperty 
          ? `meta[property="${name}"]` 
          : `meta[name="${name}"]`);
          
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
        console.log(`Updated meta tag: ${isProperty ? 'property' : 'name'}="${name}" content="${content}"`);
      };
      
      // Set basic meta tags
      updateOrCreateMetaTag('description', description);
      
      // Set Open Graph meta tags
      updateOrCreateMetaTag('og:title', fullTitle, true);
      updateOrCreateMetaTag('og:description', description, true);
      updateOrCreateMetaTag('og:image', imageWithCacheBuster, true);
      updateOrCreateMetaTag('og:url', canonicalUrl, true);
      updateOrCreateMetaTag('og:type', type, true);
      updateOrCreateMetaTag('og:site_name', 'Limitless Lab', true);
      
      // Set Twitter meta tags
      updateOrCreateMetaTag('twitter:card', 'summary_large_image');
      updateOrCreateMetaTag('twitter:title', fullTitle);
      updateOrCreateMetaTag('twitter:description', description);
      updateOrCreateMetaTag('twitter:image', imageWithCacheBuster);
      
      // Handle article specific tags
      if (type === 'article') {
        if (published) {
          updateOrCreateMetaTag('article:published_time', published, true);
        }
        if (modified) {
          updateOrCreateMetaTag('article:modified_time', modified, true);
        }
        if (tags && tags.length > 0) {
          tags.forEach(tag => {
            const metaTag = document.createElement('meta');
            metaTag.setAttribute('property', 'article:tag');
            metaTag.setAttribute('content', tag);
            document.head.appendChild(metaTag);
          });
        }
      }
      
      // Update canonical link
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', canonicalUrl);
        document.head.appendChild(canonicalLink);
      }
    }
  }, [fullTitle, description, absoluteImage, canonicalUrl, type, published, modified, tags]);

  return (
    <Helmet defer={false} prioritizeSeoTags>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} data-rh="true" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Preconnect to important resources */}
      <link rel="preconnect" href="https://crllgygjuqpluvdpwayi.supabase.co" />

      {/* Open Graph metadata */}
      <meta property="og:type" content={type} data-rh="true" />
      <meta property="og:title" content={fullTitle} data-rh="true" />
      <meta property="og:description" content={description} data-rh="true" />
      <meta property="og:url" content={canonicalUrl} data-rh="true" />
      <meta property="og:image" content={absoluteImage} data-rh="true" />
      <meta property="og:site_name" content="Limitless Lab" data-rh="true" />
      
      {/* Twitter Card metadata */}
      <meta name="twitter:card" content="summary_large_image" data-rh="true" />
      <meta name="twitter:title" content={fullTitle} data-rh="true" />
      <meta name="twitter:description" content={description} data-rh="true" />
      <meta name="twitter:image" content={absoluteImage} data-rh="true" />
      
      {/* Article specific metadata */}
      {type === 'article' && published && (
        <meta property="article:published_time" content={published} data-rh="true" />
      )}
      {type === 'article' && modified && (
        <meta property="article:modified_time" content={modified} data-rh="true" />
      )}
      {type === 'article' && tags && tags.map((tag) => (
        <meta property="article:tag" content={tag} key={tag} data-rh="true" />
      ))}
    </Helmet>
  );
}
