import { Link } from "react-router-dom";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tool } from "@/pages/Tools";
import { useToast } from "@/hooks/use-toast";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { toast } = useToast();

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page when clicking download
    
    if (tool.type === 'premium' || !tool.downloadUrl) {
      toast({
        title: "Download not available",
        description: tool.type === 'premium' ? 
          "This tool needs to be purchased before downloading." :
          "Download link is not available.",
        variant: "destructive",
      });
      return;
    }

    // Open download in new tab
    window.open(tool.downloadUrl, '_blank');
  };

  return (
    <Link to={`/tools/${tool.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-video relative">
          <img
            src={tool.imageUrl}
            alt={tool.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              tool.type === 'premium' ? 'bg-primary text-white' : 'bg-white text-gray-700'
            }`}>
              {tool.type === 'premium' ? 'Premium' : 'Free'}
            </span>
            {tool.price && (
              <span className="px-2 py-1 text-xs font-medium bg-white rounded-full">
                ${tool.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <CardHeader>
          <CardTitle className="leading-tight">{tool.title}</CardTitle>
          <CardDescription className="text-primary-600">
            {tool.category}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">{tool.description}</p>
          <div>
            <Button
              className="w-full"
              variant={tool.type === 'premium' ? "secondary" : "default"}
              onClick={handleDownload}
            >
              {tool.type === 'free' ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock for ${tool.price?.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}