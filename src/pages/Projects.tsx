import { useState, useEffect } from "react";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard";
import { ProjectBanner } from "@/components/projects/ProjectBanner";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { ProjectNavBar } from "@/components/projects/ProjectNavBar";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function Projects() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [showDesignThinkingPage, setShowDesignThinkingPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showDesignThinkingPage) {
      navigate("/dashboard/projects/create-project");
    }
  }, [showDesignThinkingPage, navigate]);

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
    <Routes>
      <Route
        path="/create-project"
        element={
          <div className="min-h-screen bg-gray-50">
            <ProjectNavBar onBackToProjects={() => setShowDesignThinkingPage(false)} />
          </div>
        }
      />
      <Route
        path="/"
        element={
          <div className="container max-w-7xl px-4 py-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Projects</h1>
              <CreateProjectButton onClick={handleOpenCreateDialog} />
            </div>

            <ProjectBanner onCreateProject={handleOpenCreateDialog} />

            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">No projects created yet</p>
                <CreateProjectButton onClick={handleOpenCreateDialog} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id}>
                    <ProjectCard {...project} />
                  </div>
                ))}
              </div>
            )}

            <CreateProjectDialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              onCreateProject={handleCreateProject}
              onStartDesignThinking={() => {
                setIsCreateDialogOpen(false);
                setShowDesignThinkingPage(true);
              }}
            />
          </div>
        }
      />
    </Routes>
  );
}
