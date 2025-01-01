import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Terms() {
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', 'terms-of-service'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'terms-of-service')
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <div className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="prose prose-lg max-w-none" 
            dangerouslySetInnerHTML={{ __html: page?.content?.html || defaultTermsContent }} 
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

const defaultTermsContent = `
  <h2>1. SCOPE OF APPLICATION</h2>
  <p>These General Terms and Conditions of Sale (hereinafter referred to as the "GTC") govern the contractual relationship between our company and you as a user of our services.</p>

  <h2>2. Use of Services</h2>
  <p>You agree to use our services only for lawful purposes and in accordance with these Terms of Service.</p>

  <h2>3. User Accounts</h2>
  <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

  <h2>4. Intellectual Property</h2>
  <p>All content, features, and functionality of our services are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>

  <h2>5. Limitation of Liability</h2>
  <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>

  <h2>6. Changes to Terms</h2>
  <p>We reserve the right to modify these terms at any time. We will notify users of any material changes.</p>
`;