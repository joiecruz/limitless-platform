import { useState } from "react";
import { Tool } from "@/types/tool";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="aspect-[16/9] relative">
        <img
          src={tool.cover_image || "/placeholder.svg"}
          alt={tool.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-8">
        <p className="text-sm text-gray-600 mb-2">{tool.category}</p>
        <h3 className="text-2xl font-bold mb-6">{tool.name}</h3>
        <Link 
          to={`/tools/${tool.id}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
        >
          Learn more
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}