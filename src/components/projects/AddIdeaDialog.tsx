
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { useProjectIdeas } from "@/hooks/useProjectIdeas";
import { useParams } from "react-router-dom";

interface AddIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
}

export function AddIdeaDialog({ open, onOpenChange, projectTitle }: AddIdeaDialogProps) {
  const { projectId = '' } = useParams();
  const { addIdea, generateIdea } = useProjectIdeas(projectId);
  const [ideaData, setIdeaData] = useState({
    title: "",
    content: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addIdea(ideaData.title, ideaData.content);
      setIdeaData({ title: "", content: "" });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateIdea(projectTitle);
      if (generated) {
        setIdeaData(generated);
      }
    } finally {
      setIsGenerating(false);
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
          <DialogTitle>Add New Idea</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-1 text-sm">
              <div className="text-muted-foreground">For challenge</div>
              <div className="font-medium">{projectTitle}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idea-title">Idea Title</Label>
              <Input 
                id="idea-title"
                placeholder="Enter a concise title for your idea"
                value={ideaData.title}
                onChange={(e) => setIdeaData({ ...ideaData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idea-description">Description</Label>
              <Textarea 
                id="idea-description"
                placeholder="Describe your idea in more detail"
                className="min-h-[150px]"
                value={ideaData.content}
                onChange={(e) => setIdeaData({ ...ideaData, content: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button"
              variant="outline"
              onClick={handleGenerate}
              disabled={isGenerating || isSubmitting}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate with AI"
              )}
            </Button>
            <Button 
              type="submit" 
              className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white"
              disabled={isSubmitting || isGenerating}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Idea"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
