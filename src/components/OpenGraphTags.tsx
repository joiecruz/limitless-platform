
import { Helmet } from "react-helmet-async";
import { thumbUrl } from "@/lib/imageUrl";

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
  // Always serve the OG image through the CDN render endpoint at 1200x630 (the size we declare).
  const ogImage = thumbUrl(imageUrl, { width: 1200, height: 630, quality: 75 }) || imageUrl;

  // Normalize the canonical / og:url: strip query strings + hash so paginated
  // and tracking-tagged variants (e.g. /?23e08153_page=2, /blog?utm=...) collapse
  // to the clean canonical URL. This prevents "Crawled - currently not indexed"
  // duplicate-content verdicts in Google Search Console.
  let canonicalUrl = url;
  try {
    const u = new URL(url);
    canonicalUrl = `${u.origin}${u.pathname.replace(/\/+$/, "") || "/"}`;
  } catch {
    canonicalUrl = url;
  }



  return (
    <Helmet prioritizeSeoTags={true}>
      {/* Debug tag to verify rendering */}
      <meta name="og-debug-id" content={debugId} />
      
      {/* Primary meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* OpenGraph tags for social sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
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
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
