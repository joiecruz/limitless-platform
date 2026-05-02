import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "@/components/tools/ToolCard";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";
import { Tool } from "@/types/tool";

const fetchTools = async () => {
  const { data, error } = await supabase
    .from('innovation_tools')
    .select('id, name, slug, cover_image, brief_description, category, type, price, downloads_count, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;

  return (data || []) as unknown as Tool[];
};

export default function Tools() {
  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools,
  });

  if (isLoading) return <LoadingQuotes />;

  if (error) {
    
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Error loading tools</h2>
        <p className="mt-2 text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Tools & Resources
        </h1>
        <p className="text-muted-foreground mt-1">
          Download free worksheets and resources to supercharge your innovation process
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools?.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
