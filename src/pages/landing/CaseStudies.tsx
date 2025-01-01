import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ITEMS_PER_PAGE = 9;

export default function CaseStudies() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('case_studies')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
      return { studies: data, total: count };
    }
  });

  const totalPages = caseStudies?.total 
    ? Math.ceil(caseStudies.total / ITEMS_PER_PAGE) 
    : 0;

  const paginatedCaseStudies = caseStudies?.studies?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Case Studies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore how we've helped organizations drive innovation and create meaningful impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedCaseStudies?.map((study) => (
            <Card 
              key={study.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/case-studies/${study.slug}`)}
            >
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                {study.cover_photo && (
                  <img
                    src={study.cover_photo}
                    alt={study.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                  {study.name}
                </h3>
                <p className="text-gray-600 line-clamp-2">
                  {study.description}
                </p>
                {study.client && (
                  <p className="text-sm text-gray-500">
                    Client: {study.client}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <CTASection />
      <Footer />
    </div>
  );
}