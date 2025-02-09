
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { useContext, useEffect } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view projects",
          variant: "destructive",
        });
        navigate("/signin");
      }
    };
    checkAuth();
  }, [navigate, toast]);

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];
      
      console.log('Fetching projects for workspace:', currentWorkspace.id);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        if (error.code === '42501') {
          toast({
            title: "Access denied",
            description: "You don't have permission to view projects in this workspace",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error fetching projects",
            description: error.message,
            variant: "destructive",
          });
        }
        throw error;
      }

      console.log('Fetched projects:', data);
      return data as Project[];
    },
    enabled: !!currentWorkspace,
  });

  if (!currentWorkspace) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Please select a workspace to view projects</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <CreateProjectDialog />
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          <p>Error loading projects. Please try again.</p>
        </div>
      )}

      {projects?.length === 0 && !isLoading ? (
        <div className="relative space-y-6 rounded-xl border border-dashed p-10 bg-white">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create more impactful projects using design thinking and AI
            </h2>
            <p className="text-muted-foreground">
              Design people-centered projects with the help of AI
            </p>
            <CreateProjectDialog />
          </div>
          <img
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets//projects-banner.png"
            alt="Projects illustration"
            className="absolute bottom-0 right-8 h-48 w-auto"
          />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
