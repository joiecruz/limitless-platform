import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { ToolHeader } from "@/components/tools/detail/ToolHeader";
import { ToolAbout } from "@/components/tools/detail/ToolAbout";
import { ToolUsage } from "@/components/tools/detail/ToolUsage";
import { ToolDownloadCTA } from "@/components/tools/detail/ToolDownloadCTA";
import { SEO } from "@/components/common/SEO";
import { useEffect } from "react";

export default function ToolDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: tool, isLoading } = useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('innovation_tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Force refresh meta tags when tool data is loaded
  useEffect(() => {
    if (tool) {
      // Manually force refresh meta tags to handle potential caching issues
      const metaRefresh = () => {
        const ogImageTag = document.querySelector('meta[property="og:image"]');
        const twitterImageTag = document.querySelector('meta[name="twitter:image"]');
        
        if (ogImageTag) {
          const currentUrl = ogImageTag.getAttribute('content') || '';
          ogImageTag.setAttribute('content', currentUrl.split('?')[0] + '?_t=' + new Date().toISOString());
        }
        
        if (twitterImageTag) {
          const currentUrl = twitterImageTag.getAttribute('content') || '';
          twitterImageTag.setAttribute('content', currentUrl.split('?')[0] + '?_t=' + new Date().toISOString());
        }
      };
      
      // Call the refresh function after a short delay to ensure React has updated the DOM
      setTimeout(metaRefresh, 300);
      
      console.log("Tool page SEO data:", {
        title: tool.name,
        description: tool.brief_description,
        image: tool.cover_image,
        canonicalUrl: `${window.location.origin}/tools/${id}`
      });
    }
  }, [tool, id]);

  const handleDownload = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to download this tool.",
        variant: "default",
      });
      navigate("/signup");
      return;
    }

    if (!tool?.download_url) {
      toast({
        title: "Download not available",
        description: "This tool is not available for download yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      window.open(tool.download_url, '_blank');
      toast({
        title: "Download started",
        description: "Your download should begin shortly.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="animate-pulse space-y-8 max-w-7xl mx-auto px-4 py-16">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-white">
        <SEO
          title="Tool Not Found"
          description="Sorry, we couldn't find the tool you're looking for."
          canonical={`${window.location.origin}/tools/not-found`}
        />
        <MainNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold">Tool not found</h2>
        </div>
      </div>
    );
  }

  // Prepare image URL with cache buster
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const imageUrl = tool.cover_image || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/tools-og-image.png";
  const imageWithCacheBuster = imageUrl.includes('?') 
    ? `${imageUrl}&_t=${timestamp}` 
    : `${imageUrl}?_t=${timestamp}`;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${tool.name} | Limitless Lab Tools`}
        description={tool.brief_description || "Explore this innovation tool from Limitless Lab"}
        image={imageWithCacheBuster}
        canonical={`${window.location.origin}/tools/${id}`}
        type="article"
      />
      
      <MainNav />
      
      <ToolHeader
        title={tool.name}
        subtitle={tool.brief_description}
        onDownload={handleDownload}
        coverImage={tool.cover_image}
      />

      <ToolAbout 
        description={tool.long_description}
        category={tool.category}
        use_case_1={tool.use_case_1}
        use_case_2={tool.use_case_2}
        use_case_3={tool.use_case_3}
      />
      
      <ToolUsage
        how_to_use={tool.how_to_use}
        when_to_use={tool.when_to_use}
      />

      <ToolDownloadCTA onDownload={handleDownload} />
      <Footer />
    </div>
  );
}
