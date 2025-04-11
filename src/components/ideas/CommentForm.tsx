
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IdeaComment } from "@/types/ideas";

interface CommentFormProps {
  ideaId: string;
  onCommentAdded: (comment: IdeaComment) => void;
}

export function CommentForm({ ideaId, onCommentAdded }: CommentFormProps) {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }
    
    const user = supabase.auth.getUser()?.data?.user;
    
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please sign in to comment", 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .insert({
          idea_id: ideaId,
          user_id: user.id,
          content: content.trim()
        })
        .select(`
          *,
          profiles:user_id (username, avatar_url, first_name, last_name)
        `)
        .single();
        
      if (error) throw error;
      
      setContent("");
      onCommentAdded(data);
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post your comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={1}
        className="resize-none mb-2"
      />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="sm"
          disabled={!content.trim() || isSubmitting}
          className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
