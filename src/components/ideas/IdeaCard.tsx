
import { useState } from "react";
import { Idea, IdeaComment } from "@/types/ideas";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";

interface IdeaCardProps {
  idea: Idea;
  viewMode: "grid" | "list";
}

export function IdeaCard({ idea, viewMode }: IdeaCardProps) {
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(idea.has_liked || false);
  const [likesCount, setLikesCount] = useState(idea.likes_count || 0);
  
  const currentUser = supabase.auth.getUser()?.data?.user;
  const isOwner = currentUser && currentUser.id === idea.user_id;
  
  const userInitials = idea.profiles?.first_name && idea.profiles?.last_name 
    ? `${idea.profiles.first_name[0]}${idea.profiles.last_name[0]}`
    : idea.profiles?.username?.substring(0, 2).toUpperCase() 
    || 'AN';
  
  const userName = idea.profiles?.first_name && idea.profiles?.last_name
    ? `${idea.profiles.first_name} ${idea.profiles.last_name}`
    : idea.profiles?.username || 'Anonymous';
  
  const timeAgo = formatDistanceToNow(new Date(idea.created_at), { addSuffix: true });
  
  const handleToggleLike = async () => {
    try {
      if (!currentUser) {
        toast({ 
          title: "Authentication required", 
          description: "Please sign in to like ideas" 
        });
        return;
      }
      
      if (hasLiked) {
        // Unlike
        const { error } = await supabase
          .from('idea_likes')
          .delete()
          .eq('idea_id', idea.id)
          .eq('user_id', currentUser.id);
          
        if (error) throw error;
        
        setHasLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Like
        const { error } = await supabase
          .from('idea_likes')
          .insert({
            idea_id: idea.id,
            user_id: currentUser.id
          });
          
        if (error) throw error;
        
        setHasLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteIdea = async () => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', idea.id);
        
      if (error) throw error;
      
      toast({
        title: 'Idea deleted',
        description: 'Your idea has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete idea',
        variant: 'destructive',
      });
    }
  };
  
  const handleToggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    
    setIsLoadingComments(true);
    setShowComments(true);
    
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select(`
          *,
          profiles:user_id (username, avatar_url, first_name, last_name)
        `)
        .eq('idea_id', idea.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingComments(false);
    }
  };
  
  const handleAddComment = (newComment: IdeaComment) => {
    setComments(prev => [...prev, newComment]);
  };
  
  const cardClass = viewMode === "grid" 
    ? "bg-card border rounded-lg shadow-sm overflow-hidden h-full flex flex-col" 
    : "bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col";
  
  return (
    <div className={cardClass}>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={idea.profiles?.avatar_url || undefined} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDeleteIdea} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
        <p className="text-muted-foreground mb-4 whitespace-pre-line">{idea.content}</p>
      </div>
      
      <div className="border-t px-4 py-3 flex justify-between items-center bg-muted/30">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleLike} 
            className={`gap-1 ${hasLiked ? 'text-rose-500' : ''}`}
          >
            <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
            {likesCount > 0 && <span>{likesCount}</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleComments} 
            className="gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            {idea.comments_count && idea.comments_count > 0 && (
              <span>{idea.comments_count}</span>
            )}
          </Button>
        </div>
        
        {/* Display tags as badges if we want to add them in the future */}
        <div className="hidden">
          <Badge variant="secondary" className="text-xs">Tag</Badge>
        </div>
      </div>
      
      {showComments && (
        <div className="border-t px-4 py-3 bg-card">
          {isLoadingComments ? (
            <div className="flex justify-center py-2">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <CommentList comments={comments} />
              <CommentForm ideaId={idea.id} onCommentAdded={handleAddComment} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
