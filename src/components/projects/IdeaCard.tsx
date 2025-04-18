
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Idea } from "@/hooks/useProjectIdeas";

interface IdeaCardProps {
  idea: Idea;
  onRate?: (ideaId: string) => Promise<void>;
  onComment?: (ideaId: string, content: string) => Promise<void>;
}

export function IdeaCard({ idea, onRate, onComment }: IdeaCardProps) {
  const [comment, setComment] = useState("");
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !onComment) return;
    
    onComment(idea.id, comment);
    setComment("");
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10">
            {getInitials(idea.author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{idea.author.name}</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{idea.content}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 p-4 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center space-x-1 hover:text-primary"
              onClick={() => onRate?.(idea.id)}
            >
              <Star className={`h-4 w-4`} />
              <span className="text-xs">{idea.stars}</span>
            </Button>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{idea.comments}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitComment} className="flex w-full gap-2">
          <Input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm" variant="ghost">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

export type { Idea as IdeaProps };
