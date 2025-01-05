import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/site-config/CTASection";

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
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tools & Resources
          </h1>
          <p className="text-xl text-gray-600">
            Download free worksheets and resources to supercharge your innovation process
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-start gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 hover:border-primary-600 hover:text-primary-600"
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
              <div 
                key={tool.id} 
                className="group relative bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
                style={{
                  background: tool.category === "Ideation and Brainstorming" ? "#40E0D0" :
                            tool.category === "Project Planning and Management" ? "#32CD32" :
                            "#4169E1"
                }}
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
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}