import { useState } from "react";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard";
import { ProjectBanner } from "@/components/projects/ProjectBanner";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { ProjectNavBar } from "@/components/projects/ProjectNavBar";

export default function CreateProject() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [showDesignThinkingPage, setShowDesignThinkingPage] = useState(false);

  const handleCreateProject = (projectData: Partial<ProjectCardProps>) => {
    const newProject: ProjectCardProps = {
      id: (projects.length + 1).toString(),
      title: projectData.title || "",
      description: projectData.description || "",
      status: projectData.status || "in_progress",
      createdAt: new Date().toISOString(),
      projectPhases: ["DT"]
    };
  
    setProjects([newProject, ...projects]);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <ProjectNavBar/>
    </>
  );
}
