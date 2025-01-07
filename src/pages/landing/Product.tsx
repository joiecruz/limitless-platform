import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site-config/CTASection";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Product() {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const handleTryForFree = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <section className="pt-20 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Innovation is messy.
                <br />
                Make it easier.
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                Our innovation platform helps you manage the risks of your projects with tried-and-tested workflows, giving you the tools to streamline your process and significantly increase your chances of success.
              </p>
              <Button
                variant="default"
                size="lg"
                className="bg-[#393CA0] hover:bg-[#2F3282] text-white px-8"
                onClick={handleTryForFree}
              >
                {session ? "Go to Dashboard" : "Try for free"}
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/product_page/Product.png"
                alt="Innovation Platform Interface"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Creativity Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/product_page/Website_Assets__3_.png"
                alt="Innovation Journey"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Leverage both the power of design thinking and AI
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6">
                Blend creativity and AI to create meaningful solutions.
              </p>
              <p className="text-lg sm:text-xl text-gray-600">
                Limitless Lab helps you uncover opportunities, refine ideas, and turn them into impactful results with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Boost your team's creativity with a simpler innovation journey
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6">
                Create and implement new ideas faster and better with our guided and structured innovation workflows designed for corporate teams, SMEs, and government innovators.
              </p>
              <p className="text-lg sm:text-xl text-gray-600">
                Our platform simplifies the process from user research, ideation, to implementation, ensuring that every idea has the best chance to thrive.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/product_page/Product-Empathize.png"
                alt="Innovation Platform Interface"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Measurement Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/product_page/Screenshot_2024-11-15_at_2.36.42_PM.png"
                alt="Impact Measurement Dashboard"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Track impact, align with the SDGs, and achieve your goals
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6">
                Make data-driven decisions using our impact measurement tools. Monitor the success of your innovation projects and align them with the Sustainable Development Goals (SDGs).
              </p>
              <p className="text-lg sm:text-xl text-gray-600">
                Whether you're a corporate innovator, a small business, or a government entity, our tools help you quantify your contributions and track your impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />

      <Footer />
    </div>
  );
}