
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { ToolkitWithItems, ToolkitItem } from "@/types/toolkit";

export default function ToolkitDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: toolkit, isLoading } = useQuery({
    queryKey: ["toolkit", id],
    queryFn: async () => {
      if (!id) throw new Error("No toolkit ID provided");

      // Fetch toolkit details
      const { data: toolkitData, error: toolkitError } = await supabase
        .from('toolkits')
        .select('*')
        .eq('id', id)
        .single();
      
      if (toolkitError) throw toolkitError;

      // Fetch toolkit items
      const { data: itemsData, error: itemsError } = await supabase
        .from('toolkit_items')
        .select('*')
        .eq('toolkit_id', id)
        .order('order_index', { ascending: true });
      
      if (itemsError) throw itemsError;

      return {
        ...toolkitData,
        items: itemsData || []
      } as ToolkitWithItems;
    },
  });

  const handleDownloadItem = async (item: ToolkitItem) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to download this resource.",
        variant: "default",
      });
      navigate("/signup");
      return;
    }

    if (!item.file_url) {
      toast({
        title: "Download not available",
        description: "This resource is not available for download yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      window.open(item.file_url, '_blank');
      toast({
        title: "Download started",
        description: `Downloading ${item.title}...`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to download these resources.",
        variant: "default",
      });
      navigate("/signup");
      return;
    }

    if (!toolkit?.items?.length) {
      toast({
        title: "No items to download",
        description: "This toolkit doesn't contain any downloadable items.",
        variant: "destructive",
      });
      return;
    }

    // Download each item individually
    toolkit.items.forEach((item, index) => {
      setTimeout(() => {
        if (item.file_url) {
          window.open(item.file_url, '_blank');
        }
      }, index * 500); // Stagger downloads by 500ms
    });

    toast({
      title: "Downloads started",
      description: `Downloading all ${toolkit.items.length} items from the toolkit...`,
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8 max-w-7xl mx-auto px-4 py-16">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-64 bg-gray-200 rounded" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!toolkit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold">Toolkit not found</h2>
        <Link to="/tools" className="text-primary hover:underline mt-4 inline-block">
          Back to Tools
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white border rounded-xl p-8 shadow-sm">
        <Link 
          to="/tools" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to tools
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-blue-600 hover:bg-blue-700">
                <FolderOpen className="w-3 h-3 mr-1" />
                Toolkit
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{toolkit.name}</h1>
            <p className="text-gray-600 mb-6">{toolkit.description}</p>
            <div className="flex items-center gap-4">
              <Button onClick={handleDownloadAll}>
                <Download className="w-4 h-4 mr-2" />
                Download All ({toolkit.items?.length || 0} items)
              </Button>
              <span className="text-sm text-gray-500">
                {toolkit.items?.length || 0} resources included
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src={toolkit.cover_image_url || "/placeholder.svg"}
              alt={toolkit.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Toolkit Items */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Included Resources</h2>
        
        {toolkit.items && toolkit.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolkit.items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                  )}
                  <Button 
                    size="sm" 
                    onClick={() => handleDownloadItem(item)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">This toolkit doesn't contain any resources yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
