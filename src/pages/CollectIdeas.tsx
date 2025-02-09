
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";

export default function CollectIdeas() {
  const { projectId } = useParams();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_step_content (
            id,
            content
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: ideas, isLoading: ideasLoading } = useQuery({
    queryKey: ['ideas', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_step_content')
        .select(`
          *,
          profiles:created_by (
            avatar_url,
            first_name,
            last_name
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (projectLoading || ideasLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collect ideas</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Star className="mr-2 h-4 w-4" />
            Generate idea
          </Button>
          <Button>
            <MessageCircle className="mr-2 h-4 w-4" />
            Add idea
          </Button>
        </div>
      </div>

      <div className="aspect-[2/1] w-full overflow-hidden rounded-lg bg-gray-100 mb-8">
        <img
          src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets//innovation-banner.jpg"
          alt="Innovation workspace"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{project?.challenge_statement}</h2>
        <p className="text-gray-600">{project?.challenge_description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas?.map((idea) => (
          <Card key={idea.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={idea.profiles?.avatar_url} />
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {idea.profiles?.first_name} {idea.profiles?.last_name}
                  </p>
                </div>
              </div>
              <Badge>{idea.content?.votes || 0} votes</Badge>
            </div>
            <h3 className="font-semibold mb-2">{idea.content?.title}</h3>
            <p className="text-gray-600 text-sm">{idea.content?.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span className="text-sm">Vote</span>
              </button>
              <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Comment</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
