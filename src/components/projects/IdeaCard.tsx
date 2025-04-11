
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";

interface Author {
  name: string;
  avatar: string;
}

export interface IdeaProps {
  id: string;
  title: string;
  description: string;
  stars: number;
  comments: number;
  author: Author;
}

interface IdeaCardProps {
  idea: IdeaProps;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{idea.description}</p>
      </CardContent>
      <CardFooter className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <Star className="h-4 w-4" />
            <span className="text-xs">{idea.stars}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{idea.comments}</span>
          </div>
        </div>
        <Avatar className="h-6 w-6">
          <img src={idea.author.avatar} alt={idea.author.name} className="rounded-full" />
        </Avatar>
      </CardFooter>
    </Card>
  );
}
