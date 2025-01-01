import { useParams, Link, useNavigate } from "react-router-dom";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CTASection } from "@/components/site-config/CTASection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
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
          <Link to="/tools" className="text-primary hover:underline mt-4 inline-block">
            Back to Tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link to="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{tool.title}</h1>
              <div className="mb-6">
                <span className="inline-block bg-[#393CA0]/10 text-[#393CA0] px-3 py-1 rounded-full text-sm font-medium">
                  {tool.category}
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the template</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Use this template to create preliminary models of your design, test functionality, and validate usability. Perfect for early-stage development and user testing.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Used for</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Testing and refining user interfaces</li>
                    <li>Gathering feedback on functionality</li>
                    <li>Validating concepts and features</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How to use</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Start by defining the objectives and key features of the app or design you want to develop. Create an interactive model using prototyping tools or software.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">When to use</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Use in early stages of app or device development to test and refine design concepts and functionalities. Perfect for validating user experience.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            
            <div className="pt-4">
              <Button 
                size="lg"
                onClick={handleDownload}
                className="w-full sm:w-auto bg-[#393CA0] hover:bg-[#2D2F7E] transition-colors"
              >
                {tool.price ? (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Unlock for ${tool.price.toFixed(2)}
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download template
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={tool.image_url || "/placeholder.svg"}
                alt={tool.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src="/lovable-uploads/5ee81b3e-851f-40a8-a4d9-16c05988a11f.png"
                  alt="Tool preview 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src="/lovable-uploads/5ee81b3e-851f-40a8-a4d9-16c05988a11f.png"
                  alt="Tool preview 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}