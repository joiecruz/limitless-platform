import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { InfiniteLogos } from "@/components/site-config/InfiniteLogos";
import { DesignThinkingSection } from "@/components/ai-homepage/DesignThinkingSection";
import { BeliefFutureSection, BeliefTransformationSection } from "@/components/ai-homepage/BeliefSections";
import { TestimonialsRailSection } from "@/components/ai-homepage/TestimonialsRailSection";
import { AIReadinessSection } from "@/components/draft-home/AIReadinessSection";
import { LoadingPage } from "@/components/common/LoadingPage";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import heroAsset from "@/assets/limitless-lab-hero.png.asset.json";
import personaEntrepreneur from "@/assets/persona-entrepreneur.png.asset.json";
import personaCorporate from "@/assets/persona-corporate.png.asset.json";
import personaPublicServant from "@/assets/persona-public-servant.png.asset.json";
import personaEducator from "@/assets/persona-educator.png.asset.json";

export default function AIHomepage() {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Grow Beyond Limits Using Human-Centered AI | Limitless Lab</title>
        <meta name="description" content="Grow beyond limits using human-centered AI. Explore Limitless Lab's approach to making AI work for people." />
      </Helmet>

      <MainNav />

      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
            <div className="text-left relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-[3.5rem] font-bold text-gray-900 mb-6 leading-[1.1]">
                Grow beyond limits with&nbsp;
                <span className="block">
                  <span
                    className="italic text-[#393CA0] text-[1.15em]"
                    style={{
                      fontFamily: '"Times New Roman", "Times New Roman Condensed", Times, serif',
                      fontStretch: "condensed",
                      fontWeight: 700,
                    }}
                  >
                    human-centered AI
                  </span>
                </span>
              </h1>
              <div className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl space-y-6">
                <p>
                  Limitless Lab helps entrepreneurs, professionals, and organizations unlock growth, lead innovation, and drive lasting impact.
                </p>
                <p>
                  We transform people and institutions through human-centered design and AI — building the mindsets, tools, and capabilities to reach their full potential.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/services")}
                  className="px-8 bg-[#393CA0] hover:bg-[#393CA0]/90 transition-colors duration-200"
                >
                  Learn More
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/programs")}
                  className="px-8 text-[#393CA0] border-[#393CA0] hover:bg-[#393CA0]/5 transition-colors duration-200"
                >
                  Take Free AI Assessment
                </Button>
              </div>
            </div>

            <div className="relative lg:h-[600px] hidden lg:block">
              <img
                src={heroAsset.url}
                alt="Team collaborating with human-centered AI"
                className="absolute top-1/2 -translate-y-1/2 left-0 w-[115%] max-w-none h-auto lg:translate-x-[5%] xl:translate-x-[10%]"
                style={{ right: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Sections */}
      <div className="py-8">
        <div className="mb-8 text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
            Trusted by 100+ leading organizations across sectors
          </h3>
        </div>
        <Suspense fallback={<LoadingPage />}>
          <div className="space-y-4">
            <InfiniteLogos direction="left" logoGroup="rectangular" />
            <InfiniteLogos direction="right" logoGroup="square" />
          </div>
        </Suspense>
      </div>

      {/* People We Help Evolve */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The people we help evolve
            </h2>
            <p className="text-lg text-gray-600">
              Find yourself in the work we do
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                image: personaEntrepreneur.url,
                title: "Entrepreneurs and Business Owners",
                imageClass: "scale-[1.2] origin-top",
              },
              {
                image: personaCorporate.url,
                title: "Corporate Teams and Professionals",
                imageClass: "scale-[1.2] origin-top",
              },
              {
                image: personaPublicServant.url,
                title: "Public Servants and Government Leaders",
                imageClass: "-mt-14",
              },
              {
                image: personaEducator.url,
                title: "Educators and Students",
                imageClass: "-mt-10",
              },
            ].map(({ image, title, imageClass }) => (
              <div
                key={title}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[360px] transition-colors duration-300 hover:border-[#393CA0]"
              >
                <h3 className="text-xl font-bold text-gray-900 px-6 pt-6 pb-2 transition-colors duration-300 group-hover:text-[#393CA0]">
                  {title}
                </h3>
                <div className="flex-1 flex items-end justify-center overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className={`w-full h-full object-contain object-bottom ${imageClass}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DesignThinkingSection />
      <BeliefFutureSection />
      <BeliefTransformationSection />
      <TestimonialsRailSection />
      <AIReadinessSection />


      <Footer />
    </div>
  );
}
