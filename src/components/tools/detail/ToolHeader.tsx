import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolHeaderProps {
  title: string;
  subtitle?: string;
  onDownload: () => void;
  onView?: () => void;
  coverImage?: string;
}

export function ToolHeader({ title, subtitle, onDownload, onView, coverImage }: ToolHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group">
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to all tools
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-lg text-gray-600 mb-8">{subtitle}</p>}
          <div className="flex gap-4">
            <Button
              onClick={onDownload}
              size="lg"
              className="bg-[#393CA0] hover:bg-[#2D2F7E] transition-colors"
            >
              Download Tool
            </Button>
            {onView && (
              <Button
                onClick={onView}
                variant="outline"
                size="lg"
                className="inline-flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Tool
              </Button>
            )}
          </div>
        </div>
        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#FFD700]">
          <img
            src={coverImage || "/placeholder.svg"}
            alt="Tool preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}