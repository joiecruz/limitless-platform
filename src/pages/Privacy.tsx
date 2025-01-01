import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Privacy() {
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', 'privacy-policy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'privacy-policy')
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <div className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="prose prose-lg max-w-none" 
            dangerouslySetInnerHTML={{ __html: page?.content?.html || defaultPrivacyContent }} 
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

const defaultPrivacyContent = `
  <h2>1. Information We Collect</h2>
  <p>We collect information that you provide directly to us, including when you create an account, use our services, or communicate with us.</p>

  <h2>2. How We Use Your Information</h2>
  <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and protect our users.</p>

  <h2>3. Information Sharing</h2>
  <p>We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our platform.</p>

  <h2>4. Data Security</h2>
  <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.</p>

  <h2>5. Your Rights</h2>
  <p>You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.</p>

  <h2>6. Contact Us</h2>
  <p>If you have any questions about this Privacy Policy, please contact us.</p>
`;