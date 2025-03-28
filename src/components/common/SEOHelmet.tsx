
import { Helmet } from "react-helmet";

interface SEOHelmetProps {
  title: string;
  description: string;
  image: string;
  canonical: string;
  type: 'website' | 'article';
  published?: string;
  modified?: string;
  tags?: string[];
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * Component for managing SEO meta tags using React Helmet
 */
export function SEOHelmet({
  title,
  description,
  image,
  canonical,
  type = 'website',
  published,
  modified,
  tags,
  imageWidth = 1200,
  imageHeight = 630
}: SEOHelmetProps) {
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Force cache busting */}
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="-1" />
      
      {/* Performance optimization */}
      <link rel="preconnect" href="https://crllgygjuqpluvdpwayi.supabase.co" />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={imageWidth.toString()} />
      <meta property="og:image:height" content={imageHeight.toString()} />
      <meta property="og:site_name" content="Limitless Lab" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={canonical} />
      
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
