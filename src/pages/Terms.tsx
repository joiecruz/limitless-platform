import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingPage } from "@/components/common/LoadingPage";

export default function Terms() {
  const { data: page, isLoading, error } = useQuery({
    queryKey: ['terms-page'],
    queryFn: async () => {
      console.log('Fetching terms of service page...');
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'terms-of-service')
        .eq('published', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching terms of service:', error);
        throw error;
      }
      
      console.log('Terms of service data:', data);
      return data;
    },
  });

  if (isLoading) return <LoadingPage />;

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Terms of Service</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">
            This page is not available at the moment. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ 
              __html: typeof page.content === 'object' && page.content.html 
                ? page.content.html 
                : '' 
            }}
          />
        </div>
      </div>
    </div>
  );
}