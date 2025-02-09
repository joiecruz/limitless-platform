
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";
import { Briefcase, Code, Database, FileText, Folder, LucideIcon } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

const defaultIcon = {
  icon: Briefcase,
  color: "rgba(255, 222, 226, 0.8)" // Soft Pink
};

const iconMap: Record<string, LucideIcon> = {
  'briefcase': Briefcase,
  'code': Code,
  'database': Database,
  'file-text': FileText,
  'folder': Folder
};

export function ProjectCard({ project }: ProjectCardProps) {
  // Use stored values or defaults
  const bgColor = project.backgroundColor || defaultIcon.color;
  const IconComponent = project.iconName ? iconMap[project.iconName] : defaultIcon.icon;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div 
        className="relative h-48 w-full overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <IconComponent 
          className="h-16 w-16 text-gray-600" 
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
