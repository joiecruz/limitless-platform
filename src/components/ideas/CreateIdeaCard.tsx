
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Lightbulb, Plus } from "lucide-react";

interface CreateIdeaCardProps {
  projectId: string;
  onIdeaCreated: () => void;
  viewMode: "grid" | "list";
  focus?: boolean;
}

export function CreateIdeaCard({ projectId, onIdeaCreated, viewMode, focus }: CreateIdeaCardProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (focus && titleInputRef.current) {
      setIsExpanded(true);
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [focus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({ 
        title: "Missing title", 
        description: "Please add a title for your idea", 
        variant: "destructive" 
      });
      return;
    }
    
    const user = supabase.auth.getUser()?.data?.user;
    
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please sign in to share ideas", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert({
          project_id: projectId,
          user_id: user.id,
          title: title.trim(),
          content: content.trim() || title.trim()
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Idea shared!",
        description: "Your idea has been added to the board"
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setIsExpanded(false);
      onIdeaCreated();
    } catch (error) {
      console.error('Error creating idea:', error);
      toast({
        title: 'Error',
        description: 'Failed to share your idea. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const cardClass = viewMode === "grid" 
    ? "h-full" 
    : "w-full";
  
  if (!isExpanded) {
    return (
      <Card className={`cursor-pointer border-dashed ${cardClass} hover:border-primary/50 hover:bg-muted/50 transition-colors`} onClick={() => setIsExpanded(true)}>
        <CardContent className="flex flex-col items-center justify-center h-full py-8">
          <div className="bg-primary/10 p-3 rounded-full mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="font-medium text-center">Share your idea</p>
          <p className="text-muted-foreground text-sm text-center">Click to add your thoughts</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cardClass}>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-medium">New Idea</p>
          </div>
          
          <div className="space-y-3">
            <Input
              ref={titleInputRef}
              placeholder="Idea title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            
            <Textarea 
              placeholder="Describe your idea (optional)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between px-4 py-3 border-t bg-muted/30">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => setIsExpanded(false)}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={!title.trim() || isSubmitting}
            className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white"
          >
            {isSubmitting ? "Sharing..." : "Share idea"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
