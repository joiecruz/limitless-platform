import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { ToolHeader } from "@/components/tools/detail/ToolHeader";
import { ToolAbout } from "@/components/tools/detail/ToolAbout";
import { ToolUsage } from "@/components/tools/detail/ToolUsage";

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
        <MainNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold">Tool not found</h2>
        </div>
      </div>
    );
  }

  const howToUse = `Start by defining the objectives and key features of the app or device you want to develop. Create an interactive model using prototyping tools or software, including essential functionalities and user flows. Test the prototype with real users to gather feedback on its usability, design, and functionality. Based on the feedback, refine and iterate on the prototype to address any issues and improve the user experience. Document insights and adjustments to guide the final development process.`;

  const whenToUse = `Use mobile prototyping to test and refine design concepts and functionalities in the early stages of app or device development. This approach is particularly useful for validating user experience, identifying potential issues, and gathering feedback before committing to full-scale production. By evaluating a preliminary model, you can make informed design decisions, address problems early, and ensure that the final product aligns with user needs and expectations.`;

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <ToolHeader
        title={tool.title}
        subtitle={tool.description}
        onDownload={handleDownload}
      />

      <ToolAbout description={tool.description} />
      
      <ToolUsage
        howToUse={howToUse}
        whenToUse={whenToUse}
      />

      <CTASection />
      <Footer />
    </div>
  );
}