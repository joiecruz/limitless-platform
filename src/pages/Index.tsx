import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

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
              src="/lovable-uploads/057d95b6-e82b-4331-b3c0-d6713b6a9837.png"
              alt="Limitless Lab Platform"
              className="w-full rounded-lg shadow-xl"
            />
            <div className="absolute -top-8 left-8">
              <img 
                src="/lovable-uploads/1d0e283e-a2bd-4829-8858-5516a6f1b45a.png"
                alt="Decorative"
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}