
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProjectCardProps } from "./ProjectCard";
import { X, Rocket, Lightbulb, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (projectData: Partial<ProjectCardProps>) => void;
}

type ProjectCreationStep = "initial" | "collectIdeas";

export function CreateProjectDialog({ open, onOpenChange, onCreateProject }: CreateProjectDialogProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<ProjectCreationStep>("initial");
  const [projectData, setProjectData] = useState<Partial<ProjectCardProps>>({
    title: "",
    description: "",
    status: "in_progress",
  });
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!projectData.title?.trim()) {
      toast({
        title: "Required field missing",
        description: "Please enter a project title or 'How Might We' question",
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
    
    setCurrentStep("initial");
    onOpenChange(false);
    
    toast({
      title: "Project Created",
      description: "Your new project has been created successfully!",
    });
  };

  const handleBack = () => {
    setCurrentStep("initial");
  };

  const handleSelectCollectIdeas = () => {
    setCurrentStep("collectIdeas");
  };

  const generateDescription = async () => {
    if (!projectData.title) {
      toast({
        title: "Required field missing",
        description: "Please enter a 'How Might We' question first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingDescription(true);
    
    try {
      // Call the Supabase Edge Function to generate a description
      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { prompt: projectData.title }
      });
      
      if (error) throw error;
      
      setProjectData(prev => ({ ...prev, description: data.generatedText }));
      
      toast({
        title: "Description Generated",
        description: "AI has created a description for your challenge",
      });
    } catch (error) {
      console.error("Error generating description:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate description. Please try again or enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const renderInitialStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>How do you want to start?</DialogTitle>
        <DialogDescription>
          Choose how you'd like to begin your innovation project
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4 py-4">
        <div 
          onClick={() => toast({ title: "Coming Soon", description: "This feature will be available soon!" })}
          className="bg-muted/20 hover:bg-muted/30 rounded-lg p-6 cursor-pointer flex flex-col items-center text-center transition-colors"
        >
          <div className="bg-[#FFEFE5] p-4 rounded-lg mb-3">
            <Rocket className="h-8 w-8 text-[#FF5722]" />
          </div>
          <h3 className="font-medium text-lg mb-1">Start with design thinking</h3>
          <p className="text-muted-foreground text-sm">Kickstart your project going through an AI-enabled design process</p>
        </div>

        <div 
          onClick={handleSelectCollectIdeas}
          className="bg-muted/20 hover:bg-muted/30 rounded-lg p-6 cursor-pointer flex flex-col items-center text-center transition-colors"
        >
          <div className="bg-[#FFF8E1] p-4 rounded-lg mb-3">
            <Lightbulb className="h-8 w-8 text-[#FFC107]" />
          </div>
          <h3 className="font-medium text-lg mb-1">Collect ideas</h3>
          <p className="text-muted-foreground text-sm">Crowdsource ideas from your colleagues for a specific design challenge</p>
        </div>
      </div>
    </>
  );

  const renderCollectIdeasStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Collect Ideas</DialogTitle>
        <DialogDescription>
          Define your design challenge to collect ideas from your team
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-title">How Might We Question</Label>
            <Input 
              id="project-title"
              placeholder="e.g. How might we improve customer onboarding experience?"
              value={projectData.title}
              onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Frame your challenge as a "How Might We" question to inspire creative solutions</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="project-description">Challenge Description</Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={generateDescription}
                disabled={isGeneratingDescription}
              >
                <Sparkles className="h-4 w-4" />
                {isGeneratingDescription ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea 
              id="project-description"
              placeholder="Provide context about the challenge and what you're trying to achieve"
              className="min-h-[100px]"
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between w-full">
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit" className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white">Create Project</Button>
        </DialogFooter>
      </form>
    </>
  );

  const handleCloseDialog = () => {
    setCurrentStep("initial");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[525px]">
        <button 
          onClick={handleCloseDialog}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        {currentStep === "initial" && renderInitialStep()}
        {currentStep === "collectIdeas" && renderCollectIdeasStep()}
      </DialogContent>
    </Dialog>
  );
}
