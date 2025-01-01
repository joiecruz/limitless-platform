import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  "All tools",
  "Stakeholder and Persona Mapping",
  "Ideation and Brainstorming",
  "Project Planning and Management",
  "Innovation Process and Tools",
  "Evaluation and Feedback",
  "Strategy and Visioning"
];

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState("All tools");

  const { data: tools } = useQuery({
    queryKey: ["innovation_tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('innovation_tools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredTools = tools?.filter(tool => 
    selectedCategory === "All tools" || tool.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <div className="bg-[#393CA0] py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h1 className="text-6xl font-bold text-white mb-8">
                Innovation
              </h1>
            </div>
            <div>
              <p className="text-white/90 text-xl leading-relaxed">
                Empower your creative process with our collection of free worksheets,
                canvases, and downloadable resources. Whether you're brainstorming new
                ideas or planning your next big project, our tools are designed to help you
                structure your thoughts and innovate effectively.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-[#393CA0] text-white"
                    : "border border-gray-300 hover:border-[#393CA0] hover:text-[#393CA0]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools?.map((tool) => (
              <div key={tool.id} className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] relative">
                  <img
                    src={tool.image_url || "/placeholder.svg"}
                    alt={tool.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">{tool.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  <Link
                    to={`/tools/${tool.id}`}
                    className="inline-flex items-center text-[#393CA0] hover:underline"
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}