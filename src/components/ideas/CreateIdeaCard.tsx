
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateIdeaCardProps {
  projectId: string;
  onIdeaCreated: () => void;
  viewMode: "grid" | "list";
  focus?: boolean;
}

export function CreateIdeaCard({ 
  projectId, 
  onIdeaCreated, 
  viewMode, 
  focus = false 
}: CreateIdeaCardProps) {
  const [isCreating, setIsCreating] = useState(focus);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isCreating && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isCreating]);
  
  const handleCreate = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your idea",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get the current user
      const { data: userData } = await supabase.auth.getSession();
      const user = userData?.session?.user;
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to share ideas",
          variant: "destructive",
        });
        return;
      }
      
      // Insert the new idea
      const { error } = await supabase
        .from("ideas")
        .insert({
          project_id: projectId,
          title,
          content: content || "",
          user_id: user.id,
        });
        
      if (error) throw error;
      
      // Reset form
      setTitle("");
      setContent("");
      setIsCreating(false);
      onIdeaCreated();
      
      toast({
        title: "Idea shared!",
        description: "Your idea has been added to the board",
      });
    } catch (error) {
      console.error("Error creating idea:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to share your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isCreating) {
    return (
      <Card 
        className={`border-dashed cursor-pointer hover:border-primary/50 transition-all ${
          viewMode === "list" ? "p-4" : "p-6"
        }`}
        onClick={() => setIsCreating(true)}
      >
        <div className="flex flex-col items-center justify-center text-muted-foreground h-full min-h-[120px]">
          <PlusCircle className="h-8 w-8 mb-2 opacity-70" />
          <p>Share a new idea</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={viewMode === "list" ? "p-4" : "p-6"}>
      <div className="space-y-4">
        <Input
          ref={titleInputRef}
          placeholder="Idea title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-medium text-lg"
          disabled={isSubmitting}
        />
        
        <Textarea
          placeholder="Describe your idea (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsCreating(false);
              setTitle("");
              setContent("");
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button 
            size="sm" 
            onClick={handleCreate}
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? "Sharing..." : "Share idea"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
