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
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <LoadingPage />;

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Privacy Policy</h1>
        <p className="text-center text-muted-foreground">
          This page is not available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div 
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page?.content?.html || '' }}
        />
      </div>
    </div>
  );
}