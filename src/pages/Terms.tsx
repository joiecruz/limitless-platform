
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingPage } from "@/components/common/LoadingPage";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { SEO } from "@/components/common/SEO";

export default function Terms() {
  const { data: page, isLoading, error } = useQuery({
    queryKey: ['terms-page'],
    queryFn: async () => {
      console.log('Fetching terms of service page...');
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'terms-of-service')
        .eq('published', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching terms of service:', error);
        throw error;
      }
      
      console.log('Terms of service data:', data);
      return data;
    },
  });

  if (isLoading) return <LoadingPage />;

  const pageTitle = page ? page.title : "Terms of Service";
  const pageDescription = page?.meta_description || "Terms of Service for Limitless Lab - Please read these terms carefully before using our platform.";
  const pageImage = page?.meta_image || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png";

  // Add cache buster to prevent social media caching
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const imageWithCacheBuster = pageImage.includes('?') 
    ? `${pageImage}&_t=${timestamp}` 
    : `${pageImage}?_t=${timestamp}`;

  if (!page) {
    return (
      <>
        <SEO 
          title={pageTitle}
          description={pageDescription}
          image={imageWithCacheBuster}
        />
        <MainNav />
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-4">Terms of Service</h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-muted-foreground">
              This page is not available at the moment. Please check back later.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={page.title}
        description={page.meta_description || pageDescription}
        image={imageWithCacheBuster}
        canonical={`${window.location.origin}/terms`}
        type="article"
      />
      <MainNav />
      <div className="flex-grow">
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-12">{page.title}</h1>
            <div 
              className="prose prose-lg max-w-none dark:prose-invert [&>p]:mb-6 [&>h2]:mt-12 [&>h2]:mb-6"
              dangerouslySetInnerHTML={{ 
                __html: typeof page.content === 'object' && page.content.html 
                  ? page.content.html 
                  : page.content.replace(/\n/g, '<br />') 
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
