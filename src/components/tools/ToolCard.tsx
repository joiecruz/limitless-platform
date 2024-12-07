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

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link to={`/tools/${tool.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-video relative">
          <img
            src={tool.imageUrl}
            alt={tool.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium bg-white rounded-full">
              {tool.price === null ? "Free" : `$${tool.price.toFixed(2)}`}
            </span>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="leading-tight">{tool.title}</CardTitle>
          <CardDescription className="text-primary-600">
            {tool.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">{tool.description}</p>
          <Button
            className="w-full"
            variant={tool.price === null ? "default" : "secondary"}
          >
            {tool.price === null ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Unlock for ${tool.price.toFixed(2)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}