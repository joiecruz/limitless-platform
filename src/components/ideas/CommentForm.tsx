
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CommentFormProps {
  ideaId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ ideaId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Get the current user
      const { data: userData } = await supabase.auth.getSession();
      const user = userData?.session?.user;
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to comment",
          variant: "destructive",
        });
        return;
      }
      
      // Insert the comment
      const { error } = await supabase
        .from("idea_comments")
        .insert({
          idea_id: ideaId,
          content: content.trim(),
          user_id: user.id,
        });
        
      if (error) throw error;
      
      // Reset form
      setContent("");
      onCommentAdded();
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        disabled={isSubmitting}
      />
      
      <div className="flex justify-end">
        <Button 
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? "Posting..." : "Post comment"}
        </Button>
      </div>
    </div>
  );
}
