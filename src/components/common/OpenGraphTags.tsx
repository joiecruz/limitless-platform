import { Helmet } from 'react-helmet-async';
import { SANITY_PROJECT_ID, SANITY_DATASET } from '@/lib/sanity';

export interface OpenGraphTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  section?: string;
  // Sanity-specific props
  sanityImage?: {
    asset: {
      _ref: string;
      url?: string;
    };
  };
}

export function OpenGraphTags({
  title,
  description,
  image = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
  section,
  sanityImage
}: OpenGraphTagsProps) {
  const baseUrl = 'https://limitlesslab.org'; // Updated to your actual domain
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  
  // Process Sanity image if provided
  let imageUrl = image;
  if (sanityImage?.asset) {
    // Use direct URL if available
    if (sanityImage.asset.url) {
      imageUrl = `${sanityImage.asset.url}?w=1200&h=630&fit=crop&crop=center`;
    } 
    // Otherwise build from _ref
    else if (sanityImage.asset._ref) {
      const imageRef = sanityImage.asset._ref;
      const [id, dimensions, format] = imageRef.split('-');
      
      // Generate a Sanity CDN URL with proper dimensions for social sharing (1200x630 is ideal for most platforms)
      imageUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}?w=1200&h=630&fit=crop&crop=center`;
      
      // Log the generated URL for debugging
      console.log('Generated Sanity image URL:', imageUrl);
    }
  }

  // Log OpenGraph data for debugging
  console.log('OpenGraph Tags Component:', { title, description, imageUrl, currentUrl, type });

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Limitless Lab" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Article specific tags */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && (
            <meta property="article:author" content={author} />
          )}
          {section && (
            <meta property="article:section" content={section} />
          )}
          {tags && tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Preload the OpenGraph image for faster rendering */}
      <link rel="preload" as="image" href={imageUrl} />
      
      {/* Debug comment visible in HTML source */}
      {/* <!-- OpenGraph Tags added by OpenGraphTags component: ${new Date().toISOString()} --> */}
    </Helmet>
  );
}
