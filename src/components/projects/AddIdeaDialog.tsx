
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface AddIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
}

export function AddIdeaDialog({ open, onOpenChange, projectTitle }: AddIdeaDialogProps) {
  const { toast } = useToast();
  const [ideaData, setIdeaData] = useState({
    title: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!ideaData.title?.trim()) {
      toast({
        title: "Required field missing",
        description: "Please enter an idea title",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically make an API call to save the idea
    console.log("Submitting idea:", ideaData);
    
    // Reset form and close dialog
    setIdeaData({
      title: "",
      description: ""
    });
    
    onOpenChange(false);
    
    toast({
      title: "Idea Added",
      description: "Your idea has been added successfully!",
    });
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
                value={ideaData.description}
                onChange={(e) => setIdeaData({ ...ideaData, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white">
              Add Idea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
