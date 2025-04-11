
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard";
import { ProjectBanner } from "@/components/projects/ProjectBanner";
import { Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectFromDB {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  owner_id: string;
}

export default function Projects() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("projects")
          .select("id, title, description, status, created_at, owner_id")
          .order("created_at", { ascending: false });
          
        if (error) {
          throw error;
        }
        
        const mappedProjects = data?.map((project: ProjectFromDB) => ({
          id: project.id,
          title: project.title || "Untitled Project",
          description: project.description || "",
          status: project.status as any,
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          projectPhases: ["DT"]
        })) || [];
        
        setProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error loading projects",
          description: "Failed to load your projects. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [toast]);

  const handleCreateProject = (projectData: Partial<ProjectCardProps>) => {
    // Add newly created project to the local state
    setProjects([{
      id: projectData.id || "",
      title: projectData.title || "",
      description: projectData.description || "",
      status: projectData.status || "in_progress",
      image: projectData.image || "",
      projectPhases: projectData.projectPhases || ["DT"]
    }, ...projects]);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container max-w-7xl px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <CreateProjectButton onClick={handleOpenCreateDialog} />
      </div>

      <ProjectBanner onCreateProject={handleOpenCreateDialog} />
      
      <div className="my-6 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFilters} 
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>
          {showFilters && (
            <span className="text-sm text-muted-foreground">
              Showing all projects
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-muted/40 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" className="text-xs">All</Button>
                <Button variant="outline" size="sm" className="text-xs">In Progress</Button>
                <Button variant="outline" size="sm" className="text-xs">Completed</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Type</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" className="text-xs">All</Button>
                <Button variant="outline" size="sm" className="text-xs">Design Thinking</Button>
                <Button variant="outline" size="sm" className="text-xs">AI Projects</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Separator className="my-6" />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Create your first project to get started</p>
          <CreateProjectButton onClick={handleOpenCreateDialog} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id}>
              <Link to={`/dashboard/projects/${project.id}`}>
                <ProjectCard {...project} />
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <CreateProjectDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
