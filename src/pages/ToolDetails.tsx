import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tool";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { data: tool, isLoading, error } = useQuery({
    queryKey: ['tool', id],
    queryFn: () => fetchTool(id!),
    enabled: !!id,
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

    window.open(tool.download_url, '_blank');
    toast({
      title: "Download started",
      description: "Your download should begin shortly.",
    });
  };

  if (isLoading) return <LoadingQuotes />;

  if (error || !tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        to="/dashboard/tools" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to tools
      </Link>

      <div className="space-y-8">
        {/* Header Section */}
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
        <div>
          <h2 className="text-2xl font-semibold mb-4">About this tool</h2>
          <p className="text-gray-600">{tool.long_description}</p>
        </div>

        {/* Use Cases Section */}
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

        {/* How to Use Section */}
        {tool.how_to_use && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
            <div 
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: tool.how_to_use }}
            />
          </div>
        )}

        {/* When to Use Section */}
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
  );
}