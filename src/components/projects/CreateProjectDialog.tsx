import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProjectCardProps } from "./ProjectCard";
import { Sparkles, X, Loader2 } from "lucide-react";
import { useProjectCreation } from "@/hooks/useProjectCreation";

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
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  const { createProject, isSubmitting } = useProjectCreation({ 
    onCreateProject, 
    onOpenChange 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject(projectData);
  };

  const generateDescription = async () => {
    if (!projectData.title?.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a project title first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingDescription(true);
    console.log("Generating description for:", projectData.title);
    
    try {
      const prompt = `How might we ${projectData.title}?`;
      console.log("Sending prompt to API:", prompt);
      
      const response = await fetch("https://crllgygjuqpluvdpwayi.supabase.co/functions/v1/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok && data.generatedText) {
        setProjectData(prev => ({
          ...prev,
          description: data.generatedText
        }));
        toast({
          title: "Description generated",
          description: "AI has created a description for your project",
        });
      } else {
        throw new Error(data.error || "Failed to generate description");
      }
    } catch (error: any) {
      console.error("Error generating description:", error);
      toast({
        title: "Generation failed",
        description: error.message || "An error occurred while generating description",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to your dashboard. You can use AI to help generate a description.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
              <div className="flex justify-between items-center">
                <Label htmlFor="project-description">Description</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={generateDescription}
                  disabled={isGeneratingDescription}
                >
                  {isGeneratingDescription ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Generate with AI</span>
                    </>
                  )}
                </Button>
              </div>
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
            <Button 
              type="submit" 
              className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
