
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolkitCard } from "@/components/tools/ToolkitCard";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";
import { Tool } from "@/types/tool";
import { Toolkit } from "@/types/toolkit";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const fetchTools = async () => {
  const { data, error } = await supabase
    .from('innovation_tools')
    .select('*');

  if (error) throw error;

  return data.map(tool => ({
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    cover_image: tool.cover_image,
    brief_description: tool.brief_description,
    category: tool.category,
    long_description: tool.long_description,
    use_case_1: tool.use_case_1,
    use_case_2: tool.use_case_2,
    use_case_3: tool.use_case_3,
    how_to_use: tool.how_to_use,
    when_to_use: tool.when_to_use,
    type: tool.type,
    price: tool.price,
    download_url: tool.download_url,
    created_at: tool.created_at,
    updated_at: tool.updated_at
  })) as Tool[];
};

const fetchToolkits = async () => {
  const { data, error } = await supabase
    .from('toolkits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Toolkit[];
};

export default function Tools() {
  const [viewMode, setViewMode] = useState<'all' | 'tools' | 'toolkits'>('all');

  const { data: tools, isLoading: toolsLoading, error: toolsError } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools,
  });

  const { data: toolkits, isLoading: toolkitsLoading, error: toolkitsError } = useQuery({
    queryKey: ['toolkits'],
    queryFn: fetchToolkits,
  });

  const isLoading = toolsLoading || toolkitsLoading;
  const error = toolsError || toolkitsError;

  if (isLoading) return <LoadingQuotes />;

  if (error) {
    console.error('Error loading tools/toolkits:', error);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Error loading resources</h2>
        <p className="mt-2 text-gray-600">Please try again later</p>
      </div>
    );
  }

  const filteredTools = viewMode === 'toolkits' ? [] : (tools || []);
  const filteredToolkits = viewMode === 'tools' ? [] : (toolkits || []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Tools & Resources
        </h1>
        <p className="text-muted-foreground mt-1">
          Download free worksheets, toolkits, and resources to supercharge your innovation process
        </p>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant={viewMode === 'all' ? 'default' : 'outline'}
            onClick={() => setViewMode('all')}
            size="sm"
          >
            All Resources
          </Button>
          <Button 
            variant={viewMode === 'tools' ? 'default' : 'outline'}
            onClick={() => setViewMode('tools')}
            size="sm"
          >
            Individual Tools
          </Button>
          <Button 
            variant={viewMode === 'toolkits' ? 'default' : 'outline'}
            onClick={() => setViewMode('toolkits')}
            size="sm"
          >
            Toolkits
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredToolkits.map((toolkit) => (
          <ToolkitCard key={`toolkit-${toolkit.id}`} toolkit={toolkit} />
        ))}
        {filteredTools.map((tool) => (
          <ToolCard key={`tool-${tool.id}`} tool={tool} />
        ))}
      </div>
      
      {filteredTools.length === 0 && filteredToolkits.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">No resources found</h2>
          <p className="mt-2 text-gray-600">Check back soon for new tools and toolkits</p>
        </div>
      )}
    </div>
  );
}
