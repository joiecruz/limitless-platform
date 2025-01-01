import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
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
      <Helmet defer={false}>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Limitless Lab" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta property="article:published_time" content={caseStudy.created_at} />
        <meta property="article:modified_time" content={caseStudy.updated_at} />
      </Helmet>
      
      <MainNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <CaseStudyHeader 
          name={caseStudy.name}
          description={caseStudy.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8" />
          <CaseStudyMeta 
            client={caseStudy.client}
            sdgs={caseStudy.sdgs}
            services={caseStudy.services}
          />
        </div>

        <CaseStudyImages 
          coverPhoto={caseStudy.cover_photo}
          name={caseStudy.name}
          additionalPhoto1={caseStudy.additional_photo1}
          additionalPhoto2={caseStudy.additional_photo2}
        />

        <CaseStudyContent
          problem={caseStudy.problem_opportunity}
          approach={caseStudy.approach}
          impact={caseStudy.impact}
        />
      </div>

      <CTASection />
      <Footer />
    </div>
  );
}