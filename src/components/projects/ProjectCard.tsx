
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";
import { Briefcase, Code, Database, FileText, Folder, LucideIcon, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

const defaultIcon = {
  icon: Briefcase,
  color: "rgba(255, 165, 150, 0.8)" // Soft Pink
};

const iconMap: Record<string, LucideIcon> = {
  'briefcase': Briefcase,
  'code': Code,
  'database': Database,
  'file-text': FileText,
  'folder': Folder
};

const backgroundColors = {
  yellow: "#FFC500CC", // 80% transparency
  purple: "#7E7DC9CC",
  turquoise: "#2FD5C8CC",
  pink: "#FF5A96CC"
};

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  
  // Use stored values or defaults, ensuring only allowed colors are used
  const bgColor = project.background_color && Object.values(backgroundColors).includes(project.background_color)
    ? project.background_color
    : backgroundColors.yellow;
  const IconComponent = project.icon_name ? iconMap[project.icon_name] : defaultIcon.icon;

  const handleCardClick = () => {
    if (project.currentPhase === 'collect-ideas') {
      navigate(`/dashboard/projects/${project.id}/collect-ideas`);
    } else {
      navigate(`/dashboard/projects/${project.id}/challenge`);
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handleCardClick}>
      {/* Settings Menu - Only visible on hover */}
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full p-2 hover:bg-black/5">
              <MoreVertical className="h-5 w-5 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Project Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Change Background Color
            </DropdownMenuItem>
            <DropdownMenuItem>
              Change Icon
            </DropdownMenuItem>
            <DropdownMenuItem>
              Edit Project Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Archive Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div 
        className="relative h-48 w-full overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <IconComponent 
          className="h-16 w-16 text-white" 
          strokeWidth={1.5}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{project.name}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Badge variant={project.status === 'completed' ? "default" : "secondary"}>
            {project.status}
          </Badge>
          {project.currentPhase && (
            <Badge variant="outline">{project.currentPhase}</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
