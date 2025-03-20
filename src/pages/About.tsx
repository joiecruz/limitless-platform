
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { SEO } from "@/components/common/SEO";
import { useEffect } from "react";

export default function About() {
  // Page metadata
  const pageTitle = "About Limitless Lab";
  const pageDescription = "Limitless Lab is a global social innovation company that uses creativity, design, and technology to drive positive change.";
  const pageImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/About%20photo.png";
  
  // Add cache buster to prevent social media caching
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const imageWithCacheBuster = pageImage.includes('?') 
    ? `${pageImage}&_t=${timestamp}` 
    : `${pageImage}?_t=${timestamp}`;
  
  // Log SEO data for debugging
  useEffect(() => {
    console.log("About page SEO data:", {
      title: pageTitle,
      description: pageDescription,
      image: imageWithCacheBuster,
      canonicalUrl: `${window.location.origin}/about`
    });
  }, [imageWithCacheBuster]);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={pageTitle}
        description={pageDescription}
        image={imageWithCacheBuster}
        canonical={`${window.location.origin}/about`}
        type="website"
      />
      
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Hello!<br />
                We are Limitless Lab
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Limitless Lab is a global social innovation company that uses creativity, design, and technology to drive positive change.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We collaborate with diverse stakeholders in building innovation capability of people, co-designing impactful solutions, and launching products and tools for changemakers and social innovators.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="w-full overflow-hidden rounded-2xl">
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/About%20photo.png"
                alt="Limitless Lab Team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
