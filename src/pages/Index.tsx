import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { InfiniteLogos } from "@/components/site-config/InfiniteLogos";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              The all-in-one platform<br />
              empowering innovators to turn<br />
              ideas into real impact
            </h1>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/signup")}
                className="px-8"
              >
                Create account
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/services")}
                className="px-8"
              >
                Explore services
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <img 
              src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png?t=2024-12-29T12%3A51%3A15.539Z"
              alt="Limitless Lab Platform"
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Logo Sections */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Client Logos */}
            <div>
              <h2 className="text-center text-lg font-semibold text-gray-600 mb-8">
                Trusted by innovative companies
              </h2>
              <InfiniteLogos category="client" direction="left" />
            </div>

            {/* User Logos */}
            <div>
              <h2 className="text-center text-lg font-semibold text-gray-600 mb-8">
                Empowering innovators worldwide
              </h2>
              <InfiniteLogos category="user" direction="right" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}