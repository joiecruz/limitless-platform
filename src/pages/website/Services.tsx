import { useEffect, useState } from "react";
import { getStoryblokApi, StoryblokComponent } from "@storyblok/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getStory = async () => {
      try {
        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get(`cdn/stories/services`, {
          version: "draft",
        });
        setStory(data?.story);
      } catch (error) {
        console.error("Error fetching Storyblok content:", error);
        toast({
          title: "Error loading content",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getStory();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {story ? (
        <StoryblokComponent blok={story.content} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Our Services</h1>
            <p className="text-gray-600">
              Connect your Storyblok space to start managing your content.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Services;