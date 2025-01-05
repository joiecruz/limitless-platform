import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tool } from "@/pages/Tools";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ToolCardProps {
  tool: Tool;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  "Stakeholder and Persona Mapping": "bg-[#FF69B4]",
  "Ideation and Brainstorming": "bg-[#40E0D0]",
  "Project Planning and Management": "bg-[#FFD700]",
  "Innovation Process and Tools": "bg-[#4169E1]",
  "Evaluation and Feedback": "bg-[#32CD32]",
  "Strategy and Visioning": "bg-[#9370DB]",
};

export function ToolCard({ tool }: ToolCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const bgColor = CATEGORY_COLORS[tool.category] || "bg-primary-500";

  return (
    <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className={`relative h-[240px] ${bgColor}`}>
        <div className="absolute inset-x-0 bottom-0 translate-y-1/3">
          <div className="mx-6 h-[180px] bg-white rounded-lg shadow-lg">
            <img
              src={tool.imageUrl || "/placeholder.svg"}
              alt={tool.title}
              className="w-full h-full rounded-lg object-contain p-4"
            />
          </div>
        </div>
      </div>
      <CardHeader className="pt-20">
        <CardTitle className="text-2xl font-bold">{tool.title}</CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link 
          to={`/tools/${tool.id}`} 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          Learn more
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}