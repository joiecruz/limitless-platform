
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
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
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
        <Helmet prioritizeSeoTags>
          <title>Case Study Not Found</title>
          <meta name="description" content="Sorry, we couldn't find the case study you're looking for." />
          <meta property="og:title" content="Case Study Not Found" />
          <meta property="og:description" content="Sorry, we couldn't find the case study you're looking for." />
          <meta property="og:type" content="website" />
        </Helmet>
        <MainNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold">Case study not found</h2>
        </div>
      </div>
    );
  }

  const pageTitle = `${caseStudy.name} | Limitless Lab Case Studies`;
  const pageDescription = caseStudy.description || "Explore this case study from Limitless Lab";
  const pageImage = caseStudy.cover_photo || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
  const canonicalUrl = `${window.location.origin}/case-studies/${caseStudy.slug}`;

  // Add additional console logs to debug OpenGraph tags
  useEffect(() => {
    console.log("Setting OpenGraph tags for case study:");
    console.log("- Title:", pageTitle);
    console.log("- Description:", pageDescription);
    console.log("- Image:", pageImage);
    console.log("- URL:", canonicalUrl);
    
    // Debug what the document head contains
    const metaTags = document.querySelectorAll('meta');
    console.log("Current meta tags in document for case study:");
    metaTags.forEach(tag => {
      console.log(`${tag.getAttribute('property') || tag.getAttribute('name')}: ${tag.getAttribute('content')}`);
    });
  }, [pageTitle, pageDescription, pageImage, canonicalUrl]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet prioritizeSeoTags>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* OpenGraph tags */}
        <meta property="og:title" content={caseStudy.name} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Limitless Lab" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={caseStudy.name} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      
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
