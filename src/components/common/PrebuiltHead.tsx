
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PrebuiltHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function PrebuiltHead({
  title = "Limitless Lab",
  description = "Limitless Lab's all-in-one innovation platform",
  image = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png",
  url = "https://limitlesslab.org",
  type = "website"
}: PrebuiltHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Limitless Lab" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preload the image */}
      <link rel="preload" as="image" href={image} />
    </Helmet>
  );
}
