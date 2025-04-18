
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
          user_id
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const enrichedIdeas = await Promise.all(ideasData.map(async (idea) => {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name, avatar_url")
          .eq("id", idea.user_id)
          .single();
          
        if (profileError) console.error("Error fetching profile:", profileError);

        const { count: starsCount, error: starsError } = await supabase
          .from("idea_likes")
          .select("id", { count: "exact" })
          .eq("idea_id", idea.id);
          
        if (starsError) console.error("Error fetching stars:", starsError);

        const { count: commentsCount, error: commentsError } = await supabase
          .from("idea_comments")
          .select("id", { count: "exact" })
          .eq("idea_id", idea.id);
          
        if (commentsError) console.error("Error fetching comments:", commentsError);

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
    let optimisticIdea: Idea | null = null;
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      optimisticIdea = {
        id: crypto.randomUUID(),
        title,
        content,
        stars: 0,
        comments: 0,
        created_at: new Date().toISOString(),
        author: {
          name: 'You',
          avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${user.id}`,
        },
      };

      setIdeas(prevIdeas => [optimisticIdea!, ...prevIdeas]);

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

      await fetchIdeas();

      toast({
        title: "Idea added",
        description: "Your idea has been added successfully!",
      });
    } catch (error: any) {
      if (optimisticIdea) {
        setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== optimisticIdea!.id));
      }
      
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
        await supabase
          .from("idea_likes")
          .delete()
          .eq("idea_id", ideaId)
          .eq("user_id", user.id);
      } else {
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

  const generateIdea = async (projectTitle: string): Promise<{title: string, content: string} | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-idea', {
        body: { projectTitle }
      });
      
      if (error) throw error;
      
      toast({
        title: "Idea generated",
        description: "AI has generated an idea based on your project."
      });
      
      return data?.idea ? {
        title: data.idea.title,
        content: data.idea.content
      } : null;
      
    } catch (error: any) {
      console.error("Error generating idea:", error);
      toast({
        title: "Error generating idea",
        description: error.message || "Failed to generate idea. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (!projectId) return;

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
