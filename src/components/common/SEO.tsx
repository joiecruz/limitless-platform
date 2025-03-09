
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

  // Update the document title directly to ensure it's available for crawlers
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = fullTitle;
      
      // Update meta tags that might be read before Helmet executes
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }

      // Ensure OG meta tags exist early for crawlers
      const ogMetas = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
      const ogValues = [fullTitle, description, absoluteImage, canonicalUrl, type];

      ogMetas.forEach((name, index) => {
        const ogMeta = document.querySelector(`meta[property="${name}"]`);
        if (ogMeta) {
          ogMeta.setAttribute('content', ogValues[index]);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', name);
          meta.setAttribute('content', ogValues[index]);
          document.head.appendChild(meta);
        }
      });
    }
  }, [fullTitle, description, absoluteImage, canonicalUrl, type]);

  return (
    <Helmet defer={false}>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

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
