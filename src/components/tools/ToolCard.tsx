import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tool } from "@/pages/Tools";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
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

    setIsDownloading(true);
    try {
      const response = await fetch(tool.downloadUrl);
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
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="relative pt-[75%]"> {/* Changed from 56.25% to 75% for 4:3 aspect ratio */}
        <div className="absolute inset-0">
          <img
            src={tool.imageUrl || "/placeholder.svg"}
            alt={tool.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
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
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          onClick={handleDownload}
          disabled={isDownloading || !tool.downloadUrl}
        >
          <Download className="w-4 h-4 mr-2" />
          {tool.type === "premium"
            ? `Download ($${tool.price})`
            : "Download Free"}
        </Button>
      </CardFooter>
    </Card>
  );
}