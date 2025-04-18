
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCardProps } from "@/components/projects/ProjectCard";

interface UseProjectCreationProps {
  onCreateProject?: (projectData: Partial<ProjectCardProps>) => void;
  onOpenChange: (open: boolean) => void;
}

export const useProjectCreation = ({ onCreateProject, onOpenChange }: UseProjectCreationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProject = async (projectData: Partial<ProjectCardProps>) => {
    if (!projectData.title?.trim()) {
      toast({
        title: "Required field missing",
        description: "Please enter a project title",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      if (!user) {
        throw new Error("You must be logged in to create a project");
      }
      
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: projectData.title,
            title: projectData.title,
            description: projectData.description || null,
            status: projectData.status,
            owner_id: user.id
          }
        ])
        .select("id, title, description, status");
      
      if (error) throw error;

      const newProject = data[0];
      
      if (onCreateProject) {
        onCreateProject({
          id: newProject.id,
          title: newProject.title,
          description: newProject.description || "",
          status: newProject.status as any,
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          projectPhases: ["DT"]
        });
      }
      
      onOpenChange(false);
      
      toast({
        title: "Project Created",
        description: "Your new project has been created successfully!",
      });
      
      navigate(`/dashboard/projects/${newProject.id}`);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error creating project",
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createProject,
    isSubmitting
  };
};
