
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";
import { Briefcase, Code, Database, FileText, Folder } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

// Function to get a random icon
const getProjectIcon = () => {
  const icons = [
    { icon: Briefcase, color: "#8E9196" },
    { icon: Code, color: "#F1F0FB" },
    { icon: Database, color: "#F1F1F1" },
    { icon: FileText, color: "#eee" },
    { icon: Folder, color: "#FFFFFF" }
  ];
  return icons[Math.floor(Math.random() * icons.length)];
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { icon: IconComponent, color: bgColor } = getProjectIcon();

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
