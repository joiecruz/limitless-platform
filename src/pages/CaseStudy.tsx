
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { supabase } from "@/integrations/supabase/client";

interface CaseStudy {
  id: number;
  slug: string;
  name: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  cover_photo: string;
  gallery: string[];
  created_at: string;
  tags: string[];
}

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCaseStudy(data as CaseStudy);
        } else {
          setError('Case study not found');
        }
      } catch (err) {
        console.error('Error fetching case study:', err);
        setError('Failed to load case study');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudy();
  }, [slug]);

  // Generate the SEO meta tags
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/case-studies/${slug}`;
  
  // Prepare meta information based on loading state and data
  let pageTitle = 'Case Study | Limitless Lab';
  let pageDescription = 'Explore our case studies to see how we help organizations innovate and make an impact.';
  
  if (caseStudy) {
    pageTitle = `${caseStudy.name} | Limitless Lab Case Studies`;
    pageDescription = caseStudy.description || 'Learn how we helped this client achieve their innovation goals.';
  }

  if (isLoading) {
    return (
      <>
        <OpenGraphTags
          title="Loading Case Study | Limitless Lab"
          description="Our case study is loading..."
          image="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
          url={canonicalUrl}
          type="article"
        />
        <MainNav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#393CA0] rounded-full border-t-transparent"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !caseStudy) {
    return (
      <>
        <OpenGraphTags
          title="Case Study Not Found | Limitless Lab"
          description="We couldn't find the case study you're looking for."
          image="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
          url={canonicalUrl}
          type="article"
        />
        <MainNav />
        <div className="min-h-screen container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-center">Case Study Not Found</h1>
          <p className="text-center mt-4">We couldn't find the case study you're looking for.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <OpenGraphTags
        title={pageTitle}
        description={pageDescription}
        image={caseStudy.cover_photo || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"}
        url={canonicalUrl}
        type="article"
      />
      
      <MainNav />
      
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{caseStudy.name}</h1>
        
        <div className="mb-8">
          <p className="text-lg text-gray-600">{caseStudy.description}</p>
        </div>
        
        {caseStudy.cover_photo && (
          <div className="mb-12">
            <img 
              src={caseStudy.cover_photo} 
              alt={caseStudy.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">The Challenge</h2>
            <div className="prose prose-lg">
              {caseStudy.challenge}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Solution</h2>
            <div className="prose prose-lg">
              {caseStudy.solution}
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <div className="prose prose-lg max-w-none">
            {caseStudy.results}
          </div>
        </div>
        
        {caseStudy.gallery && caseStudy.gallery.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseStudy.gallery.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${caseStudy.name} - Image ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {caseStudy.tags && caseStudy.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {caseStudy.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </>
  );
}
