import { useState } from "react";
import { Tool } from "@/types/tool";
import { ArrowRight, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Determine if we're in the dashboard or landing page
  const isDashboard = location.pathname.startsWith('/dashboard');
  const linkPath = isDashboard
    ? `/dashboard/tools/${tool.id}`
    : `/tools/${tool.id}`;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!tool.download_url) {
      toast({
        title: "Download not available",
        description: "This tool is not available for download yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);

      // Update download count in the database
      const { error: updateError } = await supabase
        .from('innovation_tools')
        .update({
          downloads_count: (tool.downloads_count || 0) + 1
        })
        .eq('id', tool.id);

      if (updateError) throw updateError;

      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['tool', tool.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-tools'] });

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
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
        <img
          src={tool.cover_image || "/placeholder.svg"}
          alt={tool.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-600 mb-2">{tool.category}</p>
        <h3 className="text-2xl font-semibold mb-4">{tool.name}</h3>
        <p className="text-gray-600 mb-6 line-clamp-2">
          {tool.brief_description}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to={linkPath}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
          >
            Learn more
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading || !tool.download_url}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{tool.downloads_count || 0} downloads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
