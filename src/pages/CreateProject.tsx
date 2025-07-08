import ProjectBrief from "@/pages/projects/project-brief/ProjectBrief";
import { useNavigate } from "react-router-dom";
import { ProjectNavBar } from "@/components/projects/ProjectNavBar";
import React, { useEffect, useState } from "react";

export default function CreateProject() {
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState<string>("Project Brief");

  const handleBack = () => {
    navigate("/dashboard/projects");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectNavBar />
      {/* <ProjectBrief onBack={handleBack} /> */} {/* REMOVED FOR NOW because projectbrief is called in the projectnavbar too*/} 
    </div>
  );
}
