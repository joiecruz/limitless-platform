
import { IdeaComment } from "@/types/ideas";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface CommentListProps {
  comments: IdeaComment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-2 text-sm text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mb-4">
      {comments.map((comment, index) => {
        const userInitials = comment.profiles?.first_name && comment.profiles?.last_name 
          ? `${comment.profiles.first_name[0]}${comment.profiles.last_name[0]}`
          : comment.profiles?.username?.substring(0, 2).toUpperCase() 
          || 'AN';
        
        const userName = comment.profiles?.first_name && comment.profiles?.last_name
          ? `${comment.profiles.first_name} ${comment.profiles.last_name}`
          : comment.profiles?.username || 'Anonymous';
        
        const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });
        
        return (
          <div key={comment.id}>
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo}</span>
                </div>
                
                <p className="text-sm whitespace-pre-line">{comment.content}</p>
              </div>
            </div>
            
            {index < comments.length - 1 && <Separator className="my-4" />}
          </div>
        );
      })}
    </div>
  );
}
