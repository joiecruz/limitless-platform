import { useQuery } from "@tanstack/react-query";
import { getEntries } from "@/integrations/contentful/client";
import { Card, CardContent } from "@/components/ui/card";
import { HomepageFields } from "@/types/homepage";
import { ContentfulEntry } from "@/types/contentful";

const Index = () => {
  const { data: homepageData, isLoading, error } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const entries = await getEntries("homepage");
      return entries[0] as ContentfulEntry<HomepageFields>;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching homepage data:", error);
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to Limitless Lab</h1>
            <p className="text-gray-600">
              Start building your amazing application.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { title, subtitle, heroImage } = homepageData?.fields || {};

  return (
    <div className="container mx-auto p-4">
      <Card className="overflow-hidden">
        {heroImage && (
          <div className="w-full h-64 md:h-96 relative">
            <img
              src={heroImage.fields.file.url}
              alt={heroImage.fields.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-gray-600 mb-6">
                {subtitle}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;