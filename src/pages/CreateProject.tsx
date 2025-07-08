import ProjectBrief from "@/pages/projects/project-brief/ProjectBrief";
import { useNavigate } from "react-router-dom";
import { ProjectNavBar } from "@/components/projects/ProjectNavBar";

export default function CreateProject() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard/projects");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectBrief onBack={handleBack} />
    </div>
  );
}
