
import { useState } from "react";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Rocket, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showIdeationForm, setShowIdeationForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleOptionSelect = async (type: 'design-thinking' | 'collect-ideas') => {
    if (type === 'design-thinking') {
      if (!currentWorkspace) {
        toast({
          title: "Error",
          description: "Please select a workspace first",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error("No authenticated session found");
        }

        const { data, error } = await supabase.from("projects").insert({
          name: 'Design Thinking Project',
          description: 'Project started with design thinking methodology',
          workspace_id: currentWorkspace.id,
          owner_id: session.user.id,
          status: "draft",
          current_phase: type,
        }).select().single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Project created successfully",
        });

        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      } catch (error: any) {
        console.error("Error creating project:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to create project",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setShowIdeationForm(true);
    }
  };

  const handleIdeationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWorkspace) {
      toast({
        title: "Error",
        description: "Please select a workspace first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First get the Simple Ideation workflow template
      const { data: workflowTemplates, error: templateError } = await supabase
        .from("workflow_templates")
        .select("id")
        .eq("name", "Simple Ideation")
        .limit(1);

      if (templateError) throw templateError;
      if (!workflowTemplates || workflowTemplates.length === 0) {
        throw new Error("Simple Ideation workflow template not found");
      }

      const workflowTemplateId = workflowTemplates[0].id;

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session found");
      }

      const { data, error } = await supabase.from("projects").insert({
        name: projectName,
        description: projectDescription,
        workspace_id: currentWorkspace.id,
        owner_id: session.user.id,
        status: "draft",
        current_phase: "collect-ideas",
        workflow_template_id: workflowTemplateId
      }).select().single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      
      if (data) {
        navigate(`/dashboard/projects/${data.id}/challenge`);
      }
    } catch (error: any) {
      console.error("Error in onboarding:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete setup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShowIdeationForm(false);
    setProjectName("");
    setProjectDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create new project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {!showIdeationForm ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">How do you want to start?</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => handleOptionSelect('design-thinking')}
                disabled={loading}
                className="group relative flex flex-col items-center rounded-lg border border-gray-200 bg-cream-50 p-6 text-left transition-colors hover:bg-cream-100 hover:border-gray-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center">
                  <Rocket className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold">Start with design thinking</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Kickstart your project going though an AI-enabled design process
                </p>
              </button>

              <button
                onClick={() => handleOptionSelect('collect-ideas')}
                disabled={loading}
                className="group relative flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-left transition-colors hover:bg-gray-50 hover:border-gray-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold">Collect ideas</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Crowdsource ideas from your colleagues for a specific design challenge
                </p>
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Create Ideation Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleIdeationSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Enter project description"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowIdeationForm(false)}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
