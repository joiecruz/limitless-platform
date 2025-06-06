
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/site-config/CTASection";
import { Helmet } from "react-helmet";

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

  // Page metadata
  const pageTitle = "Innovation Tools | Limitless Lab";
  const pageDescription = "Empower your creative process with our collection of free worksheets, canvases, and downloadable resources for innovation.";
  const pageImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  const canonicalUrl = `${window.location.origin}/tools`;
  
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
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* OpenGraph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Limitless Lab" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      
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
                <div className="aspect-[16/9] relative">
                  <img
                    src={tool.cover_image || "/placeholder.svg"}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">{tool.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {tool.brief_description}
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

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
