import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { CaseStudyContent } from "@/components/case-studies/CaseStudyContent";

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
        <Link to="/case-studies">
          <Button variant="ghost" className="mb-8 -ml-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            See all case studies
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {caseStudy.name}
            </h1>
            
            <p className="text-xl text-gray-600">
              {caseStudy.description}
            </p>
          </div>

          <div className="lg:col-span-4">
            {caseStudy.client && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Clients & Partners</h3>
                <p className="text-gray-900">{caseStudy.client}</p>
              </div>
            )}

            {caseStudy.sdgs && caseStudy.sdgs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2">SDGs</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.sdgs.map((sdg: string) => (
                    <span
                      key={sdg}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>
            )}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
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
      </div>

      <CTASection />
      <Footer />
    </div>
  );
}
