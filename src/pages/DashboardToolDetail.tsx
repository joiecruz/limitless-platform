import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tool";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function DashboardToolDetail() {
  const { id } = useParams();
  const { toast } = useToast();

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

    // Update downloads count
    const { error } = await supabase
      .from("innovation_tools")
      .update({ downloads_count: (tool.downloads_count || 0) + 1 })
      .eq("id", tool.id);

    if (error) {
      console.error("Error updating download count:", error);
    }

    window.open(tool.download_url, '_blank');
    toast({
      title: "Download started",
      description: "Your download should begin shortly.",
    });
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
  );
}