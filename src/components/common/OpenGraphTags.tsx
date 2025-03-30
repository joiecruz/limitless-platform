
import { Helmet } from "react-helmet-async";

interface OpenGraphTagsProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  type?: "website" | "article" | "profile";
  siteName?: string;
  publishedTime?: string;
  readTime?: number;
  categories?: string[];
}

export function OpenGraphTags({
  title,
  description,
  imageUrl,
  url,
  type = "website",
  siteName = "Limitless Lab",
  publishedTime,
  readTime,
  categories,
}: OpenGraphTagsProps) {
  // Add a unique debug ID to verify these tags are being rendered
  const debugId = `og-${Math.random().toString(36).substring(7)}`;
  
  return (
    <Helmet prioritizeSeoTags={true}>
      {/* Debug tag to verify rendering */}
      <meta name="og-debug-id" content={debugId} />
      
      {/* Primary meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* OpenGraph tags for social sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Article specific tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      
      {type === "article" && readTime && (
        <meta property="article:reading_time" content={String(readTime)} />
      )}
      
      {type === "article" && categories && categories.length > 0 && (
        categories.map((category, index) => (
          <meta key={index} property="article:tag" content={category} />
        ))
      )}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
