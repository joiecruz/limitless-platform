import { Tool } from "@/types/tool";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="aspect-[4/3] relative">
        <img
          src={tool.cover_image || "/placeholder.svg"}
          alt={tool.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">{tool.category}</p>
          <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
        </div>
        <Link 
          to={`/tools/${tool.id}`} 
          className="inline-flex items-center text-primary-600 hover:underline group-hover:gap-2 transition-all"
        >
          Learn more <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}