import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ToolHeader } from "@/components/tools/detail/ToolHeader";
import { ToolAbout } from "@/components/tools/detail/ToolAbout";
import { ToolUsage } from "@/components/tools/detail/ToolUsage";
import { ToolDownloadCTA } from "@/components/tools/detail/ToolDownloadCTA";

export default function DashboardToolDetail() {
  const { id } = useParams();
  const { toast } = useToast();

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

  const handleDownload = async () => {
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
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-64 bg-gray-200 rounded" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold">Tool not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
    </div>
  );
}