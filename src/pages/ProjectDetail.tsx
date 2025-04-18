import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { IdeaCard } from "@/components/projects/IdeaCard";
import { AddIdeaDialog } from "@/components/projects/AddIdeaDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProjectIdeas } from "@/hooks/useProjectIdeas";

interface Project {
  id: string;
  name: string;
  title: string;
  description: string | null;
  status: string;
  created_at?: string;
  owner_id?: string;
}

const ProjectDetail = () => {
  const { projectId = '' } = useParams();
  const [showAddIdeaDialog, setShowAddIdeaDialog] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { ideas, loading: ideasLoading, addIdea, rateIdea, addComment } = useProjectIdeas(projectId);
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("id, name, title, description, status, created_at, owner_id")
          .eq("id", projectId)
          .single();
        
        if (error) {
          console.error("Error fetching project:", error);
          toast({
            title: "Error loading project",
            description: "Could not load project details. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        
        setProject(data);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, toast]);
  
  if (loading) {
    return (
      <div className="container max-w-7xl px-4 py-8 flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading project...</p>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container max-w-7xl px-4 py-8">
        <div className="text-center p-6 border rounded-lg bg-muted/30">
          <h1 className="text-2xl font-bold mb-2">Project not found</h1>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl px-4 py-8 animate-fade-in">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">COLLECT IDEAS</div>
              <div className="text-sm text-muted-foreground">{ideas.length} ideas</div>
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddIdeaDialog(true)}
                className="flex items-center gap-2"
              >
                <span className="flex items-center">
                  <Plus className="h-5 w-5" />
                  Generate idea
                </span>
              </Button>
              <Button 
                onClick={() => setShowAddIdeaDialog(true)}
                className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white flex items-center gap-2"
              >
                <span className="flex items-center">
                  <Plus className="h-5 w-5" />
                  Add idea
                </span>
              </Button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mt-6 mb-4">{project.title || project.name}</h1>
          <p className="text-lg text-gray-600 max-w-5xl">{project.description}</p>
        </div>
        
        <Separator className="my-8" />
        
        {ideasLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ideas.map(idea => (
              <IdeaCard 
                key={idea.id} 
                idea={idea} 
                onRate={rateIdea}
                onComment={addComment}
              />
            ))}
          </div>
        )}
      </div>
      
      <AddIdeaDialog
        open={showAddIdeaDialog}
        onOpenChange={setShowAddIdeaDialog}
        projectTitle={project.title || project.name || ""}
      />
    </div>
  );
};

export default ProjectDetail;
