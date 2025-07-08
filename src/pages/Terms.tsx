
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Terms() {
  usePageTitle("Terms of Service | Limitless Lab");

  const { data: page, isLoading } = useQuery({
    queryKey: ["terms-of-service"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "terms-of-service")
        .eq("published", true)
        .single();

      if (error) {
        
        return null;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#393CA0]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title="Terms of Service | Limitless Lab"
        description="Terms and conditions for using Limitless Lab services."
        imageUrl="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
        url={`${window.location.origin}/terms-of-service`}
        type="website"
      />

      <MainNav />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          {page && page.content && typeof page.content === 'object' && 'html' in page.content ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: typeof page.content.html === 'string' ? 
                  page.content.html.replace(/\n/g, '<br>') : 
                  'Content not available' 
              }}
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              <p>Terms of service content is being updated. Please check back soon.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
