import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "./Tools";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";

const fetchTool = async (toolId: string) => {
  const { data, error } = await supabase
    .from('innovation_tools')
    .select('*')
    .eq('id', toolId)
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    imageUrl: data.image_url,
    price: data.price,
    downloadUrl: data.download_url
  } as Tool;
};

export default function ToolDetails() {
  const { toolId } = useParams();
  const { data: tool, isLoading, error } = useQuery({
    queryKey: ['tool', toolId],
    queryFn: () => fetchTool(toolId!),
    enabled: !!toolId,
  });

  if (isLoading) return <LoadingQuotes />;

  if (error || !tool) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Tool not found</h2>
        <Link to="/tools" className="text-primary hover:underline mt-4 inline-block">
          Back to Tools
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{tool.title}</h1>
          <p className="text-sm text-primary-600">{tool.subtitle}</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="aspect-[2/1] relative">
          <img
            src={tool.imageUrl}
            alt={tool.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{tool.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <img
              src="/lovable-uploads/5ee81b3e-851f-40a8-a4d9-16c05988a11f.png"
              alt="Tool preview"
              className="w-full rounded-lg border"
            />
          </div>

          <div className="flex justify-end">
            {tool.price === null ? (
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => tool.downloadUrl && window.open(tool.downloadUrl, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now
              </Button>
            ) : (
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Lock className="w-4 h-4 mr-2" />
                Unlock for ${tool.price.toFixed(2)}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}