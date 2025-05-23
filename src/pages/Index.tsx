
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { InfiniteLogos } from "@/components/site-config/InfiniteLogos";
import { Features } from "@/components/site-config/Features";
import { BlogSection } from "@/components/site-config/BlogSection";
import { CTASection } from "@/components/site-config/CTASection";
import { LoadingPage } from "@/components/common/LoadingPage";
import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";

export default function Index() {
  const navigate = useNavigate();
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  
  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png?t=2024-12-29T12%3A51%3A15.539Z";
    img.onload = () => setHeroImageLoaded(true);
  }, []);
  
  // Query to check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleCreateAccount = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Limitless Lab: All-in-One Innovation Platform</title>
        <meta name="description" content="Transform your innovation journey with Limitless Lab's comprehensive platform for learning, tools, and community." />
        <link rel="preload" href="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png?t=2024-12-29T12%3A51%3A15.539Z" as="image" />
      </Helmet>
      
      <MainNav />
      
      {/* Hero Section */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              The all-in-one platform<br />
              empowering innovators to turn<br />
              ideas into real impact
            </h1>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                onClick={handleCreateAccount}
                className="px-8 bg-[#393CA0] hover:bg-[#393CA0]/90 transition-colors duration-200"
              >
                {session ? "Go to Dashboard" : "Create account"}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/services")}
                className="px-8 text-[#393CA0] border-[#393CA0] hover:bg-[#393CA0]/5 transition-colors duration-200"
              >
                Explore services
              </Button>
            </div>
          </div>
          
          {/* Hero Image with loading placeholder */}
          <div className="relative -mt-[30px]">
            {!heroImageLoaded && (
              <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg animate-pulse"></div>
            )}
            <img 
              src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png?t=2024-12-29T12%3A51%3A15.539Z"
              alt="Limitless Lab Platform"
              className={`w-full rounded-lg ${!heroImageLoaded ? 'invisible absolute' : 'visible'}`}
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Logo Sections */}
      <div className="py-8">
        <div className="mb-8 text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
            Join the growing network of organizations innovating for social good
          </h3>
        </div>
        <Suspense fallback={<LoadingPage />}>
          <div className="space-y-4">
            <InfiniteLogos direction="left" logoGroup="rectangular" />
            <InfiniteLogos direction="right" logoGroup="square" />
          </div>
        </Suspense>
      </div>

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
