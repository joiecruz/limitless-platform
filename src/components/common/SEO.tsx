
import { Helmet } from "react-helmet";
import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

export function SEO({
  title = "Limitless Lab",
  description = "Transform your innovation journey with Limitless Lab's comprehensive platform for learning, tools, and community.",
  image = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png",
  url,
  type = "website",
  noindex = false,
}: SEOProps) {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullTitle = title === "Limitless Lab" ? title : `${title} | Limitless Lab`;
  
  // Ensure image is an absolute URL
  const absoluteImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;
  
  // Add canonical URL to help search engines identify the original content
  useEffect(() => {
    // Clean up any existing canonical links to avoid duplicates
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
  }, [currentUrl]);

  return (
    <Helmet defer={false}>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      
      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={fullTitle} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:site_name" content="Limitless Lab" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      
      {/* If type is article, we can add additional meta tags */}
      {type === "article" && (
        <>
          <meta property="article:publisher" content="https://limitlesslab.io" />
        </>
      )}

      {/* Favicon */}
      <link rel="icon" type="image/png" href="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Favicon_LimitlessLab.png" />
    </Helmet>
  );
}
