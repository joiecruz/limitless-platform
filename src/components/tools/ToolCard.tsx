import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tool } from "@/pages/Tools";
import { Link } from "react-router-dom";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!tool.downloadUrl) {
      toast({
        title: "Download not available",
        description: "This tool is not available for download yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      window.open(tool.downloadUrl, '_blank');
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

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="aspect-[4/3] relative bg-gradient-to-br from-yellow-400 to-orange-500">
        {tool.imageUrl && (
          <img
            src={tool.imageUrl}
            alt={tool.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{tool.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{tool.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Link 
          to={`/dashboard/tools/${tool.id}`} 
          className="text-primary hover:underline"
        >
          Learn more
        </Link>
        <Button
          onClick={handleDownload}
          disabled={!tool.downloadUrl}
        >
          <Download className="w-4 h-4 mr-2" />
          {tool.type === "premium" ? `Download ($${tool.price})` : "Download Free"}
        </Button>
      </CardFooter>
    </Card>
  );
}