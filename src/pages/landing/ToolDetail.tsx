import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { ToolHeader } from "@/components/tools/detail/ToolHeader";
import { ToolAbout } from "@/components/tools/detail/ToolAbout";
import { ToolUsage } from "@/components/tools/detail/ToolUsage";
import { ToolDownloadCTA } from "@/components/tools/detail/ToolDownloadCTA";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function ToolDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  // Set the page title based on the tool data
  usePageTitle(tool ? `${tool.name} | Limitless Lab Tools` : 'Loading Tool | Limitless Lab');

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
      // Update downloads count
      const { error } = await supabase
        .from("innovation_tools")
        .update({ downloads_count: (tool.downloads_count || 0) + 1 })
        .eq("id", tool.id);

      if (error) {
        
      } else {
        // Invalidate and refetch the current tool query to update count in real-time
        queryClient.invalidateQueries({ queryKey: ['tool', tool.id] });
        queryClient.invalidateQueries({ queryKey: ['tools'] });
        queryClient.invalidateQueries({ queryKey: ['admin-tools'] });
      }

      // Fetch the file and create a blob for download
      const response = await fetch(tool.download_url);
      if (!response.ok) throw new Error('Failed to fetch file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to download the blob
      const link = document.createElement('a');
      link.href = url;
      link.download = tool.name || 'tool-download';
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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
        <OpenGraphTags
          title="Tool Not Found"
          description="Sorry, we couldn't find the tool you're looking for."
          imageUrl="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
          url={window.location.href}
          type="website"
        />
        <MainNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold">Tool not found</h2>
        </div>
      </div>
    );
  }

  const pageTitle = `${tool.name} | Limitless Lab Tools`;
  const pageDescription = tool.brief_description || "Explore this innovation tool from Limitless Lab";
  const pageImage = tool.cover_image || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  const canonicalUrl = `${window.location.origin}/tools/${tool.id}`;

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title={pageTitle}
        description={pageDescription}
        imageUrl={pageImage}
        url={canonicalUrl}
        type="website"
      />

      <MainNav />

      <ToolHeader
        title={tool.name}
        subtitle={tool.brief_description}
        onDownload={handleDownload}
        onView={() => setIsViewModalOpen(true)}
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

      {/* View Tool Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{tool?.name} - Tool Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={tool?.download_url || "/placeholder.svg"}
              alt={tool?.name}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
