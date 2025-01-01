import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CTASection() {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const handleClick = () => {
    if (session) {
      window.location.href = 'https://app.limitlesslab.org/dashboard';
    } else {
      window.location.href = 'https://app.limitlesslab.org/signup';
    }
  };

  return (
    <div className="bg-[#393CA0] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Start innovating for
          <span className="block text-[#66E6F5]">impact today</span>
        </h2>
        <Button 
          onClick={handleClick}
          size="lg"
          className="bg-white text-[#393CA0] hover:bg-gray-100 px-8 py-6 text-lg"
        >
          {session ? "Go to Dashboard" : "Register for free"}
        </Button>
      </div>
    </div>
  );
}