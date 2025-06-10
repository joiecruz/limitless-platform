import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tool";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Eye } from "lucide-react";

export default function DashboardToolDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: tool, isLoading } = useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("innovation_tools")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Tool;
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
      // Update downloads count
      const { error } = await supabase
        .from("innovation_tools")
        .update({ downloads_count: (tool.downloads_count || 0) + 1 })
        .eq("id", tool.id);

      if (error) {
        console.error("Error updating download count:", error);
      } else {
        // Invalidate relevant queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['tools'] });
        queryClient.invalidateQueries({ queryKey: ['tool', tool.id] });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading tool details...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Tool not found</h2>
        <Link
          to="/dashboard/tools"
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Tools
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 p-6">
        {/* Header Section with white container */}
        <div className="bg-white border rounded-xl p-8 shadow-sm">
          <Link
            to="/dashboard/tools"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to tools
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{tool.name}</h1>
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

        {/* Description Section */}
        {tool.long_description && (
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600 leading-relaxed">{tool.long_description}</p>
          </div>
        )}

        {/* Use Cases Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Use Cases</h2>
          <ul className="space-y-2">
            {tool.use_case_1 && (
              <li className="flex items-start gap-2">
                <span className="text-primary-600">•</span>
                <span className="text-gray-600">{tool.use_case_1}</span>
              </li>
            )}
            {tool.use_case_2 && (
              <li className="flex items-start gap-2">
                <span className="text-primary-600">•</span>
                <span className="text-gray-600">{tool.use_case_2}</span>
              </li>
            )}
            {tool.use_case_3 && (
              <li className="flex items-start gap-2">
                <span className="text-primary-600">•</span>
                <span className="text-gray-600">{tool.use_case_3}</span>
              </li>
            )}
          </ul>
        </div>

        {/* How to Use */}
        {tool.how_to_use && (
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">How to Use</h2>
            <div
              className="text-gray-600 leading-relaxed prose"
              dangerouslySetInnerHTML={{ __html: tool.how_to_use }}
            />
          </div>
        )}

        {/* When to Use */}
        {tool.when_to_use && (
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">When to Use</h2>
            <div
              className="text-gray-600 leading-relaxed prose"
              dangerouslySetInnerHTML={{ __html: tool.when_to_use }}
            />
          </div>
        )}
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