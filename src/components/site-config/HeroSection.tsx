import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function HeroSection() {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const handleCreateAccount = () => {
    if (session) {
      window.location.href = 'https://app.limitlesslab.org/dashboard';
    } else {
      window.location.href = 'https://app.limitlesslab.org/signup';
    }
  };

  return (
    <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
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
        
        <div className="relative -mt-[30px]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png?t=2024-12-29T12%3A51%3A15.539Z"
            alt="Limitless Lab Platform"
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}