
import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = "Limitless Lab",
  description = "Transform your innovation journey with Limitless Lab's comprehensive platform for learning, tools, and community.",
  image = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png",
  url,
  type = "website",
}: SEOProps) {
  const currentUrl = url || typeof window !== 'undefined' ? window.location.href : '';
  const fullTitle = title === "Limitless Lab" ? title : `${title} | Limitless Lab`;
  
  return (
    <Helmet defer={false}>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:site_name" content="Limitless Lab" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
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
