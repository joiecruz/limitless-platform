
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Idea {
  id: string;
  title: string;
  content: string;
  stars: number;
  comments: number;
  created_at: string;
  author: {
    name: string;
    avatar: string;
  };
}

export const useProjectIdeas = (projectId: string) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const { data: ideasData, error } = await supabase
        .from("ideas")
        .select(`
          id,
          title,
          content,
          created_at,
          user_id,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url
          ),
          (
            SELECT count(*) 
            FROM idea_likes 
            WHERE idea_id = ideas.id
          ) as stars,
          (
            SELECT count(*) 
            FROM idea_comments 
            WHERE idea_id = ideas.id
          ) as comments
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedIdeas = ideasData.map(idea => ({
        id: idea.id,
        title: idea.title,
        content: idea.content,
        stars: idea.stars || 0,
        comments: idea.comments || 0,
        created_at: idea.created_at,
        author: {
          name: idea.profiles ? 
            `${idea.profiles.first_name || ''} ${idea.profiles.last_name || ''}`.trim() || 'Anonymous' 
            : 'Anonymous',
          avatar: idea.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avatars/svg?seed=' + idea.user_id
        }
      }));

      setIdeas(formattedIdeas);
    } catch (error: any) {
      console.error("Error fetching ideas:", error);
      toast({
        title: "Error loading ideas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addIdea = async (title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from("ideas")
        .insert([
          {
            title,
            content,
            project_id: projectId,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Idea added",
        description: "Your idea has been added successfully!",
      });

      await fetchIdeas();
    } catch (error: any) {
      console.error("Error adding idea:", error);
      toast({
        title: "Error adding idea",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateIdea = async (projectTitle: string) => {
    try {
      const response = await fetch("https://crllgygjuqpluvdpwayi.supabase.co/functions/v1/generate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: `Generate an innovative idea for this challenge: ${projectTitle}`
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate idea");
      }

      const data = await response.json();
      return {
        title: data.title,
        content: data.description
      };
    } catch (error: any) {
      console.error("Error generating idea:", error);
      toast({
        title: "Error generating idea",
        description: "Failed to generate idea. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchIdeas();
    }
  }, [projectId]);

  return {
    ideas,
    loading,
    addIdea,
    generateIdea
  };
};
