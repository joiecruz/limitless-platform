
import { Helmet } from "react-helmet";

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
  const canonicalUrl = canonical || window.location.href;
  
  // Ensure image is an absolute URL
  const absoluteImage = image.startsWith('http') 
    ? image 
    : `${window.location.origin}${image}`;

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
