
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";
import { Briefcase, Code, Database, FileText, Folder } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

// Function to get a random icon with matching background color
const getProjectIcon = () => {
  const icons = [
    { icon: Briefcase, color: "rgba(255, 222, 226, 0.8)" },  // Soft Pink
    { icon: Code, color: "rgba(211, 228, 253, 0.8)" },      // Soft Blue
    { icon: Database, color: "rgba(253, 225, 211, 0.8)" },  // Soft Peach
    { icon: FileText, color: "rgba(214, 188, 250, 0.8)" },  // Light Purple
    { icon: Folder, color: "rgba(242, 252, 226, 0.8)" }     // Soft Green
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
