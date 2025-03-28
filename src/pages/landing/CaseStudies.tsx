
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/site-config/CTASection";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";

export default function CaseStudies() {
  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ["case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const pageTitle = "Case Studies | Limitless Lab";
  const pageDescription = "Explore our portfolio of impactful projects and success stories across various industries and social innovation challenges.";
  const pageImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  const canonicalUrl = `${window.location.origin}/case-studies`;

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
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-8">Case Studies</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Explore our portfolio of impactful projects and success stories
              across various industries and social innovation challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {caseStudies?.map((study) => (
                <Link key={study.id} to={`/case-studies/${study.slug}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <img
                        src={study.cover_image || "/placeholder.svg"}
                        alt={study.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                          {study.industry}
                        </span>
                        {study.year && (
                          <span className="text-sm text-gray-500 ml-3">
                            {study.year}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-[#393CA0] transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {study.summary}
                      </p>
                      <div className="inline-flex items-center text-[#393CA0] font-medium">
                        View case study <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
