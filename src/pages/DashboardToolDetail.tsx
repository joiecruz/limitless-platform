import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tool";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DashboardToolDetail() {
  const { id } = useParams();

  const { data: tool, isLoading } = useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("innovation_tools")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Tool;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading tool details...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Tool not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
        <p className="text-gray-600">{tool.brief_description}</p>
      </div>

      {/* Cover Image */}
      {tool.cover_image && (
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img
            src={tool.cover_image}
            alt={tool.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Download Button */}
      {tool.download_url && (
        <div>
          <Button
            onClick={() => window.open(tool.download_url!, "_blank")}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Tool
          </Button>
        </div>
      )}

      {/* Description */}
      {tool.long_description && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Description</h2>
          <p className="text-gray-600 leading-relaxed">{tool.long_description}</p>
        </div>
      )}

      {/* Use Cases */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Use Cases</h2>
        <ul className="space-y-2">
          {tool.use_case_1 && (
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span className="text-gray-600">{tool.use_case_1}</span>
            </li>
          )}
          {tool.use_case_2 && (
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span className="text-gray-600">{tool.use_case_2}</span>
            </li>
          )}
          {tool.use_case_3 && (
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span className="text-gray-600">{tool.use_case_3}</span>
            </li>
          )}
        </ul>
      </div>

      {/* How to Use */}
      {tool.how_to_use && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">How to Use</h2>
          <div 
            className="text-gray-600 leading-relaxed prose"
            dangerouslySetInnerHTML={{ __html: tool.how_to_use }}
          />
        </div>
      )}

      {/* When to Use */}
      {tool.when_to_use && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">When to Use</h2>
          <div 
            className="text-gray-600 leading-relaxed prose"
            dangerouslySetInnerHTML={{ __html: tool.when_to_use }}
          />
        </div>
      )}
    </div>
  );
}