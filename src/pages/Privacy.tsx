import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingPage } from "@/components/common/LoadingPage";

export default function Privacy() {
  const { data: page, isLoading } = useQuery({
    queryKey: ['privacy-page'],
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

  if (isLoading) return <LoadingPage />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: page?.content?.html || 'Privacy policy not found.' }}
      />
    </div>
  );
}