import { useParams } from "react-router-dom";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CTASection } from "@/components/site-config/CTASection";
import { Link } from "react-router-dom";

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
        <Link to="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">About the template</h2>
                <p className="text-gray-600">
                  Use this template to create preliminary models of your design, test functionality, and validate usability. Perfect for early-stage development and user testing.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Used for</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Testing and refining user interfaces and interactions</li>
                  <li>Gathering feedback on usable app functionality and design</li>
                  <li>Validating concepts and features before full-scale development</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">How to use</h2>
                <p className="text-gray-600">
                  Start by defining the objectives and key features of the app or design you want to develop. Create an interactive model using prototyping tools or software, including essential functionalities you plan to test.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">When to use</h2>
                <p className="text-gray-600">
                  Use mobile prototyping to test and refine design concepts and functionalities in the early stages of app or device development. This approach is particularly useful for validating user experience.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                size="lg"
                onClick={handleDownload}
                className="w-full sm:w-auto bg-[#393CA0] hover:bg-[#2D2F7E]"
              >
                <Download className="mr-2 h-5 w-5" />
                Download template
              </Button>
            </div>
          </div>
          
          <div>
            <img
              src={tool.image_url || "/placeholder.svg"}
              alt={tool.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}