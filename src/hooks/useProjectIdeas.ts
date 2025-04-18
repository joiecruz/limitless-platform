
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
      // First fetch basic idea information
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
          )
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get counts separately
      const ideasWithCounts = await Promise.all(ideasData.map(async (idea) => {
        // Get stars count
        const { count: starsCount, error: starsError } = await supabase
          .from("idea_likes")
          .select("id", { count: "exact" })
          .eq("idea_id", idea.id);
          
        if (starsError) console.error("Error fetching stars:", starsError);

        // Get comments count
        const { count: commentsCount, error: commentsError } = await supabase
          .from("idea_comments")
          .select("id", { count: "exact" })
          .eq("idea_id", idea.id);
          
        if (commentsError) console.error("Error fetching comments:", commentsError);

        // Handle profiles data safely with proper type casting
        // The profiles field might be an array with a single object or null
        // Extract the first item if it's an array
        const profileData = Array.isArray(idea.profiles) 
          ? (idea.profiles.length > 0 ? idea.profiles[0] : null) 
          : idea.profiles;
        
        // Create a properly typed author object
        const authorName = profileData 
          ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous'
          : 'Anonymous';
          
        const authorAvatar = profileData?.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${idea.user_id}`;
        
        return {
          id: idea.id,
          title: idea.title,
          content: idea.content,
          stars: starsCount || 0,
          comments: commentsCount || 0,
          created_at: idea.created_at,
          author: {
            name: authorName,
            avatar: authorAvatar
          }
        };
      }));

      setIdeas(ideasWithCounts);
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
