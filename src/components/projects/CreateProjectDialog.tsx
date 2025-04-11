
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProjectCardProps } from "./ProjectCard";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (projectData: Partial<ProjectCardProps>) => void;
}

export function CreateProjectDialog({ open, onOpenChange, onCreateProject }: CreateProjectDialogProps) {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<Partial<ProjectCardProps>>({
    title: "",
    description: "",
    status: "in_progress",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!projectData.title?.trim()) {
      toast({
        title: "Required field missing",
        description: "Please enter a project title",
        variant: "destructive",
      });
      return;
    }
    
    // Call the onCreateProject callback with the project data
    if (onCreateProject) {
      onCreateProject(projectData);
    }
    
    // Reset form and close dialog
    setProjectData({
      title: "",
      description: "",
      status: "in_progress",
    });
    
    onOpenChange(false);
    
    toast({
      title: "Project Created",
      description: "Your new project has been created successfully!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter the details of your new innovation project. You can add more information later.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-title">Project Title</Label>
              <Input 
                id="project-title"
                placeholder="Enter project title"
                value={projectData.title}
                onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea 
                id="project-description"
                placeholder="Describe your project"
                className="min-h-[100px]"
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
