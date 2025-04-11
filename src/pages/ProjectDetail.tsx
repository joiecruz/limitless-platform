
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Star, MessageSquare, Plus, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { IdeaCard } from "@/components/projects/IdeaCard";
import { AddIdeaDialog } from "@/components/projects/AddIdeaDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Sample idea data - would come from API in real implementation
const sampleIdeas = [
  {
    id: "1",
    title: "Innovation Hubs",
    description: "Establish dedicated innovation labs or hubs within the company",
    stars: 3,
    comments: 1,
    author: {
      name: "Jane Cooper",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  {
    id: "2",
    title: "Hackathons",
    description: "Organize company-wide hackaton to enable innovatoin",
    stars: 11,
    comments: 1,
    author: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  {
    id: "3",
    title: "Give incentives",
    description: "Provide free gift certificates for those who will start innovation",
    stars: 24,
    comments: 0,
    author: {
      name: "Emma Jones",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  {
    id: "4",
    title: "Innovation Hubs",
    description: "Establish dedicated innovation labs or hubs within the company",
    stars: 34,
    comments: 3,
    author: {
      name: "Mark Wilson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  }
];

interface Project {
  id: string;
  name: string;  // Added name property
  title: string;
  description: string | null;
  status: string;
  created_at?: string;
  owner_id?: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [showAddIdeaDialog, setShowAddIdeaDialog] = useState(false);
  const [ideas] = useState(sampleIdeas);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
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
        {/* Header section */}
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
        
        {/* Ideas grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ideas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
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
