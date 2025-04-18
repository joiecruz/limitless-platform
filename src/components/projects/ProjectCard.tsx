import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Image, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'testing' | 'prototyping' | 'measure';
  image?: string;
  projectPhases?: string[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onImageChange?: (id: string) => void;
}

export function ProjectCard({ 
  id,
  title, 
  description, 
  status, 
  image, 
  projectPhases = [],
  onEdit,
  onDelete,
  onImageChange,
}: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const fallbackImage = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on the settings menu
    if ((e.target as HTMLElement).closest('.settings-menu')) {
      e.preventDefault();
      return;
    }
    navigate(`/dashboard/projects/${id}`);
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col cursor-pointer relative" 
      onClick={handleCardClick}
    >
      <div className="absolute top-4 right-4 z-10 settings-menu">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit?.(id)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onImageChange?.(id)} className="gap-2">
              <Image className="h-4 w-4" />
              Change photo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(id)} 
              className="text-red-600 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-56 overflow-hidden">
        <img 
          src={image || fallbackImage} 
          alt={title} 
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader>
        <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t p-4">
        <div className="flex items-center">
          <ProjectStatusBadge status={status} />
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
