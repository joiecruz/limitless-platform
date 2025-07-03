
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'testing' | 'prototyping' | 'measure';
  creator?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    email: string;
  };
  createdAt: string;
  currentStage?: string;
  projectPhases?: string[];
  designChallenge?: string;
  canDelete?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({ 
  title, 
  description, 
  status, 
  creator, 
  createdAt, 
  currentStage, 
  projectPhases = [], 
  designChallenge,
  canDelete = false,
  onClick,
  onDelete
}: ProjectCardProps) {
  
  const getInitials = (firstName: string | null, lastName: string | null, email: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const getStageDisplay = (stage?: string) => {
    if (!stage) return "Project Brief";
    // Convert stage names to readable format
    return stage.charAt(0).toUpperCase() + stage.slice(1).replace(/_/g, ' ');
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          {canDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive hover:text-destructive p-1 h-auto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {description}
          </p>
        )}
        
        {designChallenge && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-primary mb-1 block">Design Challenge</span>
            <p className="text-muted-foreground text-sm line-clamp-2 italic">
              {designChallenge}
            </p>
          </div>
        )}
        
        {creator && (
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={creator.avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {getInitials(creator.first_name, creator.last_name, creator.email)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {creator.first_name && creator.last_name
                ? `${creator.first_name} ${creator.last_name}`
                : creator.email}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </span>
          <div className="flex items-center gap-2">
            <ProjectStatusBadge status={status} />
            <Badge variant="outline" className="text-xs">
              {getStageDisplay(currentStage)}
            </Badge>
          </div>
        </div>
        <div className="flex -space-x-2">
          {projectPhases.map((phase, index) => (
            <Badge 
              key={index} 
              className="h-8 w-8 rounded-md p-1 flex items-center justify-center text-xs font-bold border"
              variant="outline"
            >
              {phase}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
