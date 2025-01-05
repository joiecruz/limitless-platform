import { useState } from "react";
import { Tool } from "@/types/tool";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ToolCardProps {
  tool: Tool;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  "Stakeholder and Persona Mapping": "#FF69B4",
  "Ideation and Brainstorming": "#40E0D0",
  "Project Planning and Management": "#FFD700",
  "Innovation Process and Tools": "#4169E1",
  "Evaluation and Feedback": "#32CD32",
  "Strategy and Visioning": "#9370DB",
};

export function ToolCard({ tool }: ToolCardProps) {
  const bgColor = CATEGORY_COLORS[tool.category] || "bg-primary-500";

  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
      style={{ background: bgColor }}
    >
      <div className="aspect-[4/3] relative p-8">
        <div className="bg-white rounded-lg p-4 w-full h-full flex items-center justify-center">
          <img
            src={tool.cover_image || "/placeholder.svg"}
            alt={tool.name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="bg-white p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">{tool.category}</p>
          <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
          <p className="mt-2 text-gray-600">{tool.brief_description}</p>
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