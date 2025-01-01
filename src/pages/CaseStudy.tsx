import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { format } from "date-fns";
import { useEffect } from "react";
import { Loader2, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet";

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
        <meta property="article:published_time" content={caseStudy.date_published} />
        <meta property="article:modified_time" content={caseStudy.updated_at} />
        {caseStudy.service_types && caseStudy.service_types.map((type: string) => (
          <meta property="article:tag" content={type} key={type} />
        ))}
      </Helmet>
      
      <MainNav />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="flex items-center gap-2 text-primary mb-6">
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Case Study</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
          <time dateTime={caseStudy.date_published}>
            {format(new Date(caseStudy.date_published), 'MMMM d, yyyy')}
          </time>
          {caseStudy.service_types && caseStudy.service_types.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-2">
                {caseStudy.service_types.map((type: string) => (
                  <span
                    key={type}
                    className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
          {caseStudy.name}
        </h1>
        
        {caseStudy.cover_photo && (
          <div className="aspect-video w-full mb-12 rounded-lg overflow-hidden">
            <img
              src={caseStudy.cover_photo}
              alt={caseStudy.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {caseStudy.client && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Client</h2>
            <p className="text-gray-600">{caseStudy.client}</p>
          </div>
        )}

        {caseStudy.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-600">{caseStudy.description}</p>
          </div>
        )}

        {caseStudy.problem_opportunity && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Problem/Opportunity</h2>
            <p className="text-gray-600">{caseStudy.problem_opportunity}</p>
          </div>
        )}

        {caseStudy.approach && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Our Approach</h2>
            <p className="text-gray-600">{caseStudy.approach}</p>
          </div>
        )}

        {caseStudy.impact && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Impact</h2>
            <p className="text-gray-600">{caseStudy.impact}</p>
          </div>
        )}

        {caseStudy.quote_from_customer && (
          <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 my-8">
            "{caseStudy.quote_from_customer}"
          </blockquote>
        )}

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
      </article>

      <CTASection />
      <Footer />
    </div>
  );
}