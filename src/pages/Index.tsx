import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateAccount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="flex flex-col items-center justify-center py-32">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Our Platform</h1>
        <p className="text-lg text-gray-600 mb-8">Join us to start your innovation journey.</p>
        <Button 
          size="lg" 
          className="px-8 bg-[#393CA0] hover:bg-[#393CA0]/90 transition-colors duration-200"
          onClick={handleCreateAccount}
        >
          Create account
        </Button>
      </div>
      <Footer />
    </div>
  );
}