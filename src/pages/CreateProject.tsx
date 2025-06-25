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
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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
