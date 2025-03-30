
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CaseStudyHeader } from "@/components/case-studies/CaseStudyHeader";
import { CaseStudyMeta } from "@/components/case-studies/CaseStudyMeta";
import { CaseStudyContent } from "@/components/case-studies/CaseStudyContent";
import { CaseStudyImages } from "@/components/case-studies/CaseStudyImages";
import { CTASection } from "@/components/site-config/CTASection";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";

export default function CaseStudy() {
  const { slug } = useParams();
  const { toast } = useToast();

  // Log the slug value to help with debugging
  useEffect(() => {
    console.log("Case study slug:", slug);
  }, [slug]);

  const { data: caseStudy, isLoading, error } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: async () => {
      console.log("Fetching case study with slug:", slug);
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error("Error fetching case study:", error);
        toast({
          title: "Error loading case study",
          description: "Unable to load the case study. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Case study data:", data);
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle error state
  useEffect(() => {
    if (error) {
      console.error("Error loading case study:", error);
    }
  }, [error]);

  // Define variables outside conditional rendering
  const defaultImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  const canonicalUrl = `${window.location.origin}/case-studies/${slug}`;
  
  // Define meta data based on case study availability
  const pageTitle = caseStudy 
    ? `${caseStudy.name} | Limitless Lab Case Studies` 
    : isLoading 
      ? "Loading Case Study | Limitless Lab" 
      : "Case Study Not Found | Limitless Lab";
  
  const pageDescription = caseStudy 
    ? (caseStudy.description || "Explore this case study from Limitless Lab").substring(0, 160)
    : isLoading
      ? "Loading case study from Limitless Lab"
      : "Sorry, we couldn't find the case study you're looking for.";
  
  const pageImage = caseStudy?.cover_photo || defaultImage;

  // Debug OpenGraph tags
  useEffect(() => {
    console.log("Case Study Debug Info:");
    console.log("- URL:", canonicalUrl);
    console.log("- Slug:", slug);
    console.log("- Case Study loaded:", !!caseStudy);
    console.log("- Image:", pageImage);
  }, [canonicalUrl, slug, caseStudy, pageImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <OpenGraphTags
          title="Loading Case Study | Limitless Lab"
          description="Loading case study from Limitless Lab"
          imageUrl={defaultImage}
          url={canonicalUrl}
          type="article"
        />
        <MainNav />
        <div className="animate-pulse space-y-8 max-w-7xl mx-auto px-4 py-16">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-white">
        <OpenGraphTags
          title="Case Study Not Found | Limitless Lab"
          description="Sorry, we couldn't find the case study you're looking for."
          imageUrl={defaultImage}
          url={canonicalUrl}
          type="article"
        />
        <MainNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold">Case study not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title={pageTitle}
        description={pageDescription}
        imageUrl={pageImage}
        url={canonicalUrl}
        type="article"
      />
      
      <MainNav />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <CaseStudyHeader 
          name={caseStudy.name} 
          description={caseStudy.description || ""}
        />
        
        <CaseStudyMeta 
          client={caseStudy.client} 
          sdgs={caseStudy.sdgs} 
          services={caseStudy.services}
        />
        
        <CaseStudyContent 
          problem={caseStudy.problem_opportunity}
          approach={caseStudy.approach}
          impact={caseStudy.impact}
        />
        
        {(caseStudy.cover_photo || caseStudy.additional_photo1 || caseStudy.additional_photo2) && (
          <CaseStudyImages 
            coverPhoto={caseStudy.cover_photo}
            name={caseStudy.name}
            additionalPhoto1={caseStudy.additional_photo1}
            additionalPhoto2={caseStudy.additional_photo2}
          />
        )}
      </article>

      <CTASection />
      <Footer />
    </div>
  );
}
