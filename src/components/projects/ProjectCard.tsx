
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'testing' | 'prototyping' | 'measure';
  image?: string;
  projectPhases?: string[];
}

export function ProjectCard({ title, description, status, image, projectPhases = [] }: ProjectCardProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
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
