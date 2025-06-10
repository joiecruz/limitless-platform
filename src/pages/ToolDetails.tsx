import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tool";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const fetchTool = async (toolId: string) => {
  const { data, error } = await supabase
    .from('innovation_tools')
    .select('*')
    .eq('id', toolId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Tool not found');

  return data as Tool;
};

export default function ToolDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { data: tool, isLoading, error } = useQuery({
    queryKey: ['tool', id],
    queryFn: () => fetchTool(id!),
    enabled: !!id,
  });

  // Set the page title based on the tool data
  usePageTitle(tool ? `${tool.name} | Innovation Tool` : 'Loading Tool | Limitless Lab');

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
      // Update downloads count
      const { error } = await supabase
        .from("innovation_tools")
        .update({ downloads_count: (tool.downloads_count || 0) + 1 })
        .eq("id", tool.id);

      if (error) {
        console.error("Error updating download count:", error);
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
      console.error("Error during download:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <LoadingQuotes />;

  if (error || !tool) {
    return (
      <div className="max-w-7xl mx-auto pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <OpenGraphTags
          title="Tool Not Found"
          description="Sorry, the requested tool could not be found."
          imageUrl="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
          url={window.location.href}
          type="website"
        />
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Tool not found</h2>
          <Link
            to="/dashboard/tools"
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <OpenGraphTags
          title={`${tool.name} | Innovation Tool`}
          description={tool.brief_description || ""}
          imageUrl={tool.cover_image || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"}
          url={window.location.href}
          type="website"
        />

        <Link
          to="/dashboard/tools"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to tools
        </Link>

        <div className="space-y-8">
          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4">{tool.name}</h1>
                <p className="text-gray-600 mb-6">{tool.brief_description}</p>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleDownload}
                    className="inline-flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Tool
                  </Button>
                  <Button
                    onClick={() => setIsViewModalOpen(true)}
                    variant="outline"
                    className="inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Tool
                  </Button>
                  <span className="text-sm text-gray-500">
                    {tool.downloads_count || 0} downloads
                  </span>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img
                  src={tool.cover_image || "/placeholder.svg"}
                  alt={tool.name}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">About this tool</h2>
            <p className="text-gray-600">{tool.long_description}</p>
          </div>

          {(tool.use_case_1 || tool.use_case_2 || tool.use_case_3) && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Use Cases</h2>
              <ul className="space-y-3">
                {tool.use_case_1 && (
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    {tool.use_case_1}
                  </li>
                )}
                {tool.use_case_2 && (
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    {tool.use_case_2}
                  </li>
                )}
                {tool.use_case_3 && (
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    {tool.use_case_3}
                  </li>
                )}
              </ul>
            </div>
          )}

          {tool.how_to_use && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
              <div
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: tool.how_to_use }}
              />
            </div>
          )}

          {tool.when_to_use && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">When to Use</h2>
              <div
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: tool.when_to_use }}
              />
            </div>
          )}
        </div>
      </div>

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
    </>
  );
}
