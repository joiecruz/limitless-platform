
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

type MetaTag = 
  | { property: string; content: string }
  | { name: string; content: string };

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
      
      // Remove all existing meta tags that we're going to replace
      // This ensures our dynamic tags take precedence over static ones in index.html
      const removeMetaTags = (selector: string) => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };
      
      // Remove standard description and OG meta tags
      removeMetaTags('meta[name="description"]');
      removeMetaTags('meta[property^="og:"]');
      removeMetaTags('meta[name^="twitter:"]');
      removeMetaTags('meta[property^="article:"]');
      
      // Create a new meta description tag
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);

      // Ensure OG meta tags exist early for crawlers
      const ogTags: MetaTag[] = [
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:image', content: absoluteImage },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: type },
        { property: 'og:site_name', content: 'Limitless Lab' }
      ];

      // Add Twitter card tags
      const twitterTags: MetaTag[] = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: absoluteImage }
      ];

      // Update or create all OG tags
      [...ogTags, ...twitterTags].forEach(tag => {
        const meta = document.createElement('meta');
        if ('property' in tag) {
          meta.setAttribute('property', tag.property);
        } else {
          meta.setAttribute('name', tag.name);
        }
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      });

      // Handle article specific tags
      if (type === 'article') {
        if (published) {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:published_time');
          meta.setAttribute('content', published);
          document.head.appendChild(meta);
        }

        if (modified) {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:modified_time');
          meta.setAttribute('content', modified);
          document.head.appendChild(meta);
        }
        
        // Add tags for article
        if (tags && tags.length > 0) {
          tags.forEach(tag => {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'article:tag');
            meta.setAttribute('content', tag);
            document.head.appendChild(meta);
          });
        }
      }
      
      // Ensure canonical link is set
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
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Preconnect to important resources */}
      <link rel="preconnect" href="https://crllgygjuqpluvdpwayi.supabase.co" />

      {/* Open Graph metadata */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content="Limitless Lab" />
      
      {/* Twitter Card metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      
      {/* Article specific metadata */}
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
