import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolHeaderProps {
  title: string;
  subtitle?: string;
  onDownload: () => void;
}

export function ToolHeader({ title, subtitle, onDownload }: ToolHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group">
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        See all tools
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-lg text-gray-600 mb-8">{subtitle}</p>}
          <Button 
            onClick={onDownload}
            size="lg"
            className="bg-[#393CA0] hover:bg-[#2D2F7E] transition-colors"
          >
            Get template
          </Button>
        </div>
        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#FFD700]">
          <img
            src="/lovable-uploads/adfba729-479c-4408-b470-41dc5f7630c9.png"
            alt="Tool preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}