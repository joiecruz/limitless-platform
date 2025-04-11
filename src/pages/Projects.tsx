
import { useState } from "react";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard";
import { ProjectBanner } from "@/components/projects/ProjectBanner";

// Example project data - in a real app this would come from an API
const sampleProjects: ProjectCardProps[] = [
  {
    id: "1",
    title: "New Credit Card Product for Small Business Owners",
    description: "Create an attractive new credit card offering for entrepreneurs and small business owners",
    status: "in_progress",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    projectPhases: ["DT", "AI"]
  },
  {
    id: "2",
    title: "Green Loan Initiative",
    description: "A loan product designed specifically for financing environmentally friendly projects, such as renewable energy installations, energy-efficient buildings, and sustainable agriculture practices.",
    status: "testing",
    image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    projectPhases: ["DT", "AI"]
  },
  {
    id: "3",
    title: "Mobile Banking for Rural Areas",
    description: "Development of a mobile banking app tailored for rural populations, providing easy access to banking services such as savings accounts, loans, and remittances",
    status: "completed",
    image: "https://images.unsplash.com/photo-1599253208431-2f0ea49cae26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=986&q=80",
    projectPhases: ["AI", "DT"]
  },
  {
    id: "4",
    title: "Crypto Investment Platform",
    description: "Building a user-friendly platform for cryptocurrency investments with advanced risk management tools and educational resources",
    status: "prototyping",
    image: "https://images.unsplash.com/photo-1518544866330-ec6aba2ec7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    projectPhases: ["AI"]
  },
  {
    id: "5",
    title: "Design Thinking Workshop Series",
    description: "Creation of a workshop series to train internal teams on design thinking methods and innovation practices",
    status: "in_progress",
    image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    projectPhases: ["DT"]
  },
  {
    id: "6",
    title: "Financial Wellness App",
    description: "App that combines budgeting tools with behavioral science insights to promote better financial habits and decision-making",
    status: "measure",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    projectPhases: ["DT", "AI"]
  }
];

export default function Projects() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState(sampleProjects);

  const handleCreateProject = (projectData: Partial<ProjectCardProps>) => {
    // In a real app, you would call an API to create the project
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
    <div className="container max-w-7xl px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <CreateProjectButton onClick={handleOpenCreateDialog} />
      </div>

      <ProjectBanner onCreateProject={handleOpenCreateDialog} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id}>
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
      
      <CreateProjectDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
