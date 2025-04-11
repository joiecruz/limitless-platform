
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'testing' | 'prototyping' | 'measure';
  image?: string;
  projectPhases?: string[];
}

export function ProjectCard({ title, description, status, image, projectPhases = [] }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'testing':
        return 'bg-purple-100 text-purple-800';
      case 'prototyping':
        return 'bg-orange-100 text-orange-800';
      case 'measure':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'testing':
        return 'Testing';
      case 'prototyping':
        return 'Prototyping';
      case 'completed':
        return 'Completed';
      case 'measure':
        return 'Measure';
      default:
        return status;
    }
  };

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
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
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
