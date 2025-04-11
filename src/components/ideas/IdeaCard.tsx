
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Idea } from "@/types/ideas";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";

interface IdeaCardProps {
  idea: Idea;
  viewMode: "grid" | "list";
}

export function IdeaCard({ idea, viewMode }: IdeaCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<Idea>(idea);
  const { toast } = useToast();
  
  const handleLikeToggle = async () => {
    try {
      setIsLiking(true);
      
      // Get the current user
      const { data: userData } = await supabase.auth.getSession();
      const user = userData?.session?.user;
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to like ideas",
          variant: "destructive",
        });
        return;
      }
      
      if (currentIdea.has_liked) {
        // Unlike the idea
        const { error } = await supabase
          .from("idea_likes")
          .delete()
          .eq("idea_id", idea.id)
          .eq("user_id", user.id);
          
        if (error) throw error;
        
        setCurrentIdea({
          ...currentIdea,
          likes_count: (currentIdea.likes_count || 0) - 1,
          has_liked: false,
        });
      } else {
        // Like the idea
        const { error } = await supabase
          .from("idea_likes")
          .insert({
            idea_id: idea.id,
            user_id: user.id,
          });
          
        if (error) throw error;
        
        setCurrentIdea({
          ...currentIdea,
          likes_count: (currentIdea.likes_count || 0) + 1,
          has_liked: true,
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to process your like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };
  
  const onCommentAdded = () => {
    setCurrentIdea({
      ...currentIdea,
      comments_count: (currentIdea.comments_count || 0) + 1,
    });
  };
  
  const authorName = currentIdea.profiles?.first_name 
    ? `${currentIdea.profiles.first_name} ${currentIdea.profiles.last_name || ''}`
    : currentIdea.profiles?.username || 'Anonymous';
    
  const timeAgo = formatDistanceToNow(new Date(currentIdea.created_at), { addSuffix: true });
  
  return (
    <Card className={viewMode === "list" ? "p-4" : "p-6"}>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{currentIdea.title}</h3>
          {currentIdea.content && (
            <p className="mt-2 text-muted-foreground whitespace-pre-line">{currentIdea.content}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{authorName}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
          
          {(currentIdea.likes_count || currentIdea.comments_count) ? (
            <div className="flex items-center gap-3">
              {currentIdea.likes_count! > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{currentIdea.likes_count}</span>
                </Badge>
              )}
              
              {currentIdea.comments_count! > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{currentIdea.comments_count}</span>
                </Badge>
              )}
            </div>
          ) : null}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={currentIdea.has_liked ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleLikeToggle}
            disabled={isLiking}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{currentIdea.has_liked ? "Liked" : "Like"}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comment</span>
          </Button>
        </div>
        
        {showComments && (
          <div className="pt-2">
            <Separator className="mb-4" />
            <CommentForm ideaId={currentIdea.id} onCommentAdded={onCommentAdded} />
            <div className="mt-4">
              <CommentList ideaId={currentIdea.id} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
