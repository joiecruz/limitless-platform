
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/common/SEO";
import { CaseStudyContent } from "@/components/case-studies/CaseStudyContent";
import { CaseStudyHeader } from "@/components/case-studies/CaseStudyHeader";
import { CaseStudyMeta } from "@/components/case-studies/CaseStudyMeta";
import { CaseStudyImages } from "@/components/case-studies/CaseStudyImages";

export default function CaseStudy() {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!caseStudy) {
    return <div>Case study not found</div>;
  }

  const title = caseStudy.name || "Case Study";
  const description = caseStudy.description || "";
  const imageUrl = caseStudy.cover_photo || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/og-image.png";
  const canonicalUrl = `${window.location.origin}/case-studies/${caseStudy.slug}`;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={title}
        description={description}
        image={imageUrl}
        canonical={canonicalUrl}
        type="article"
        published={caseStudy.created_at}
        modified={caseStudy.updated_at}
      />
      
      <MainNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8">
            <CaseStudyHeader 
              name={caseStudy.name}
              description={caseStudy.description}
            />
          </div>
          <div className="lg:col-span-4">
            <CaseStudyMeta 
              client={caseStudy.client}
              sdgs={caseStudy.sdgs}
              services={caseStudy.services}
            />
          </div>
        </div>

        {caseStudy.cover_photo && (
          <div className="w-full mb-12">
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <img
                src={caseStudy.cover_photo}
                alt={caseStudy.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <CaseStudyContent
          problem={caseStudy.problem_opportunity}
          approach={caseStudy.approach}
          impact={caseStudy.impact}
        />

        {(caseStudy.additional_photo1 || caseStudy.additional_photo2) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {caseStudy.additional_photo1 && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={caseStudy.additional_photo1}
                  alt="Additional case study photo 1"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {caseStudy.additional_photo2 && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={caseStudy.additional_photo2}
                  alt="Additional case study photo 2"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <CTASection />
      <Footer />
    </div>
  );
}
