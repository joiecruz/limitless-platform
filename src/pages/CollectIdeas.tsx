
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Idea } from "@/types/ideas";
import { IdeasHeader } from "@/components/ideas/IdeasHeader";
import { IdeasBoard } from "@/components/ideas/IdeasBoard";
import { IdeasEmpty } from "@/components/ideas/IdeasEmpty";
import { useToast } from "@/hooks/use-toast";

export default function CollectIdeas() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<any | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!projectId) return;
    
    // Fetch project details
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Project not found",
            description: "The project you're looking for doesn't exist or you don't have access to it.",
            variant: "destructive",
          });
          navigate("/projects");
          return;
        }
        
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details.",
          variant: "destructive",
        });
      }
    };
    
    // Fetch ideas for the project
    const fetchIdeas = async () => {
      try {
        const { data, error } = await supabase
          .from("ideas")
          .select(`
            *,
            profiles:user_id (username, avatar_url, first_name, last_name)
          `)
          .eq("project_id", projectId)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Get likes count for each idea
        if (data && data.length > 0) {
          const { data: userData } = await supabase.auth.getSession();
          const currentUserId = userData?.session?.user?.id;
          
          const ideasWithCounts = await Promise.all(
            data.map(async (idea) => {
              // Get likes count
              const { count: likesCount, error: likesError } = await supabase
                .from("idea_likes")
                .select("*", { count: "exact", head: true })
                .eq("idea_id", idea.id);
                
              // Get comments count
              const { count: commentsCount, error: commentsError } = await supabase
                .from("idea_comments")
                .select("*", { count: "exact", head: true })
                .eq("idea_id", idea.id);
                
              // Check if current user has liked this idea
              let hasLiked = false;
              if (currentUserId) {
                const { data: likeData, error: likeError } = await supabase
                  .from("idea_likes")
                  .select("id")
                  .eq("idea_id", idea.id)
                  .eq("user_id", currentUserId)
                  .maybeSingle();
                  
                hasLiked = !!likeData;
              }
              
              return {
                ...idea,
                likes_count: likesCount || 0,
                comments_count: commentsCount || 0,
                has_liked: hasLiked
              };
            })
          );
          
          setIdeas(ideasWithCounts);
        } else {
          setIdeas([]);
        }
      } catch (error) {
        console.error("Error fetching ideas:", error);
        toast({
          title: "Error",
          description: "Failed to load ideas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
    fetchIdeas();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('ideas-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ideas',
        filter: `project_id=eq.${projectId}`
      }, () => {
        // Refetch ideas when data changes
        fetchIdeas();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, navigate, toast]);
  
  if (loading) {
    return (
      <div className="container max-w-7xl px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading ideas...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl px-4 py-8 animate-fade-in">
      {project && <IdeasHeader project={project} />}
      
      {ideas.length > 0 ? (
        <IdeasBoard 
          projectId={projectId!} 
          ideas={ideas} 
          onIdeaAdded={() => {}}
        />
      ) : (
        <IdeasEmpty projectId={projectId!} />
      )}
    </div>
  );
}
