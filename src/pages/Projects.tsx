import { useState } from "react";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard";
import { ProjectBanner } from "@/components/projects/ProjectBanner";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function Projects() {
  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // const [projects, setProjects] = useState<ProjectCardProps[]>([]);

  // const handleCreateProject = (projectData: Partial<ProjectCardProps>) => {
  //   const newProject: ProjectCardProps = {
  //     id: (projects.length + 1).toString(),
  //     title: projectData.title || "",
  //     description: projectData.description || "",
  //     status: projectData.status || "in_progress",
  //     image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  //     projectPhases: ["DT"]
  //   };
  //
  //   setProjects([newProject, ...projects]);
  // };

  // const handleOpenCreateDialog = () => {
  //   setIsCreateDialogOpen(true);
  // };

  return (
    // <div className="container max-w-7xl px-4 py-8 animate-fade-in">
    //   <div className="flex justify-between items-center mb-8">
    //     <h1 className="text-3xl font-bold">Projects</h1>
    //     <CreateProjectButton onClick={handleOpenCreateDialog} />
    //   </div>

    //   <ProjectBanner onCreateProject={handleOpenCreateDialog} />

    //   {projects.length === 0 ? (
    //     <div className="text-center py-12 text-muted-foreground">
    //       <p className="mb-4">No projects created yet</p>
    //       <CreateProjectButton onClick={handleOpenCreateDialog} />
    //     </div>
    //   ) : (
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //       {projects.map((project) => (
    //         <div key={project.id}>
    //           <ProjectCard {...project} />
    //         </div>
    //       ))}
    //     </div>
    //   )}

    //   <CreateProjectDialog
    //     open={isCreateDialogOpen}
    //     onOpenChange={setIsCreateDialogOpen}
    //     onCreateProject={handleCreateProject}
    //   />
    // </div>
    <div className="container mx-auto py-8">
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Briefcase className="h-16 w-16 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900">Projects In Development</h1>
          <p className="text-gray-500 max-w-md">
            We're working on building an amazing project management experience. Stay tuned for updates!
          </p>
        </div>
      </Card>
    </div>
  );
}
