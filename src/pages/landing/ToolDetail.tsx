import { useParams } from "react-router-dom";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ToolDetail() {
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
      const response = await fetch(tool.download_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = tool.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

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
    return <div>Loading...</div>;
  }

  if (!tool) {
    return <div>Tool not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={tool.image_url || "/placeholder.svg"}
              alt={tool.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">{tool.title}</h1>
            <div className="mb-6">
              <span className="inline-block bg-[#393CA0]/10 text-[#393CA0] px-3 py-1 rounded-full text-sm">
                {tool.category}
              </span>
            </div>
            <p className="text-gray-600 mb-8 text-lg">
              {tool.description}
            </p>
            
            <Button
              size="lg"
              onClick={handleDownload}
              className="w-full sm:w-auto"
              disabled={!tool.download_url}
            >
              <Download className="mr-2 h-5 w-5" />
              {tool.type === "premium" ? `Download ($${tool.price})` : "Download Free"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}