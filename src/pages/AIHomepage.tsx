import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { InfiniteLogos } from "@/components/site-config/InfiniteLogos";
import { Features } from "@/components/site-config/Features";
import { BlogSection } from "@/components/site-config/BlogSection";
import { CTASection } from "@/components/site-config/CTASection";
import { LoadingPage } from "@/components/common/LoadingPage";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { Rocket, Building2, Landmark, GraduationCap } from "lucide-react";

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
      <div className="min-h-[85vh] flex items-center pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-left mb-12 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Grow beyond limits using{" "}
              <span
                className="italic text-[#393CA0]"
                style={{
                  fontFamily: '"Times New Roman", "Times New Roman Condensed", Times, serif',
                  fontStretch: "condensed",
                }}
              >
                human-centered AI
              </span>
              .
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl">
              We work with changemakers across sectors—from individuals and businesses to governments—to solve real-world problems using innovation, emerging tech, and human-centered design.
            </p>
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
                Take Free Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Sections */}
      <div className="py-8">
        <div className="mb-8 text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
            We've worked with
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
              We partner with the people shaping tomorrow—across sectors, scales, and missions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                Icon: Rocket,
                title: "Entrepreneurs & Small Businesses",
                desc: "Build, launch, and scale with AI-powered tools and human-centered design.",
              },
              {
                Icon: Building2,
                title: "Corporate Teams",
                desc: "Unlock innovation capability and modern ways of working across your organization.",
              },
              {
                Icon: Landmark,
                title: "Public Servants",
                desc: "Design better services and policies with citizen-centered, AI-enabled approaches.",
              },
              {
                Icon: GraduationCap,
                title: "Educators & Students",
                desc: "Learn the skills, mindsets, and tools to thrive in an AI-shaped future.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#393CA0]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#393CA0]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <Suspense fallback={<LoadingPage />}>
        <Features />
      </Suspense>

      {/* Blog Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
            <p className="mt-4 text-lg text-gray-600">
              Stay updated with our latest insights and news
            </p>
          </div>
          <Suspense fallback={<LoadingPage />}>
            <BlogSection />
          </Suspense>
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/blog')}
              className="px-8 text-[#393CA0] border-[#393CA0] hover:bg-[#393CA0]/5 transition-colors duration-200"
            >
              View All Articles
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
