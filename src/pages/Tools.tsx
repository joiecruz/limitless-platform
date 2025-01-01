import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "@/components/tools/ToolCard";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";
import { Button } from "@/components/ui/button";

export interface Tool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  price: number | null;
  downloadUrl?: string;
  type: 'free' | 'premium';
  category: string;
}

const CATEGORIES = [
  "All tools",
  "Stakeholder and Persona Mapping",
  "Ideation and Brainstorming",
  "Project Planning and Management",
  "Innovation Process and Tools",
  "Evaluation and Feedback",
  "Strategy and Visioning"
];

const fetchTools = async () => {
  const { data, error } = await supabase
    .from('innovation_tools')
    .select('*');

  if (error) throw error;

  return data.map(tool => ({
    id: tool.id,
    title: tool.title,
    subtitle: tool.subtitle,
    description: tool.description,
    imageUrl: tool.image_url,
    price: tool.price,
    downloadUrl: tool.download_url,
    type: tool.type,
    category: tool.category
  }));
};

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState("All tools");
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

  const filteredTools = tools?.filter(tool => 
    selectedCategory === "All tools" || tool.category === selectedCategory
  );

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools?.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}