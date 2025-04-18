
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
          user_id
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get profile information separately to avoid the relationship error
      const enrichedIdeas = await Promise.all(ideasData.map(async (idea) => {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name, avatar_url")
          .eq("id", idea.user_id)
          .single();
          
        if (profileError) console.error("Error fetching profile:", profileError);

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

      setIdeas(enrichedIdeas);
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
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ideas")
        .insert([
          {
            title,
            content,
            project_id: projectId,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // After successfully adding, fetch the complete idea data with all relationships
      await fetchIdeas();

      toast({
        title: "Idea added",
        description: "Your idea has been added successfully!",
      });
    } catch (error: any) {
      console.error("Error adding idea:", error);
      toast({
        title: "Error adding idea",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const rateIdea = async (ideaId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const { data: existingLike } = await supabase
        .from("idea_likes")
        .select()
        .eq("idea_id", ideaId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingLike) {
        // Unlike if already liked
        await supabase
          .from("idea_likes")
          .delete()
          .eq("idea_id", ideaId)
          .eq("user_id", user.id);
      } else {
        // Like if not already liked
        await supabase
          .from("idea_likes")
          .insert([{ idea_id: ideaId, user_id: user.id }]);
      }

      await fetchIdeas();
    } catch (error: any) {
      console.error("Error rating idea:", error);
      toast({
        title: "Error rating idea",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addComment = async (ideaId: string, content: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      await supabase
        .from("idea_comments")
        .insert([{
          idea_id: ideaId,
          user_id: user.id,
          content
        }]);

      await fetchIdeas();
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully!",
      });
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!projectId) return;

    // Subscribe to changes
    const channel = supabase
      .channel('ideas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          fetchIdeas();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'idea_likes'
        },
        () => {
          fetchIdeas();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'idea_comments'
        },
        () => {
          fetchIdeas();
        }
      )
      .subscribe();

    // Initial fetch
    fetchIdeas();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return {
    ideas,
    loading,
    addIdea,
    generateIdea,
    rateIdea,
    addComment
  };
};
