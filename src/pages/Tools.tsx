import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "@/components/tools/ToolCard";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";
import { Tool } from "@/types/tool";

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
    downloads_count: tool.downloads_count,
    created_at: tool.created_at,
    updated_at: tool.updated_at
  })) as Tool[];
};

export default function Tools() {
  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools,
  });

  if (isLoading) return <LoadingQuotes />;

  if (error) {
    console.error('Error loading tools:', error);
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
