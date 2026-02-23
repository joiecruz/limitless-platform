import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectBrief from "../../pages/projects/project-brief/ProjectBrief";
import Empathize from "../../pages/projects/design-thinking/Empathize";
import Define from "../../pages/projects/design-thinking/Define";
import Prototype from "../../pages/projects/design-thinking/Prototype";
import Test from "../../pages/projects/design-thinking/Test";
//import ProjectTest from "@/pages/projects/project-test/ProjectTest";
import Implement from "../../pages/projects/design-thinking/Implement";
import Measure from "../../pages/projects/design-thinking/Measure";
import Ideate from "../../pages/projects/design-thinking/Ideate";
import { usePageTitle } from '@/hooks/usePageTitle';

const designThinkingSteps = [
  { label: "Project Brief", icon: "/projects-navbar-icons/paper.svg" },
  { label: "Empathize", icon: "/projects-navbar-icons/heart.svg" },
  { label: "Define", icon: "/projects-navbar-icons/resize.svg" },
  { label: "Ideate", icon: "/projects-navbar-icons/lightbulb.svg" },
  { label: "Prototype", icon: "/projects-navbar-icons/shape.svg" },
  { label: "Test", icon: "/projects-navbar-icons/paper-airplane.svg" },
  { label: "Implement", icon: "/projects-navbar-icons/todo.svg" },
  { label: "Measure", icon: "/projects-navbar-icons/ruler.svg" },
];

// Create context for step navigation
interface StepNavigationContextType {
  changeStep: (step: string) => void;
  selectedStep: string | null;
}

const StepNavigationContext = createContext<StepNavigationContextType | undefined>(undefined);

// Custom hook to use the step navigation context
export const useStepNavigation = () => {
  const context = useContext(StepNavigationContext);
  if (context === undefined) {
    throw new Error('useStepNavigation must be used within a ProjectNavBar');
  }
  return context;
};

interface ProjectNavBarProps {
  onBackToProjects?: () => void;
}

export function ProjectNavBar({ onBackToProjects }: ProjectNavBarProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [projectMeta, setProjectMeta] = useState<any>({});
  const [hasIdeateNote, setHasIdeateNote] = useState(false);
  const [prototypeIsComplete, setPrototypeIsComplete] = useState(false);
  const [defineIsComplete, setDefineIsComplete] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();

  usePageTitle(selectedStep || 'Project');

  useEffect(() => {
    if (projectId) {
      // Fetch project metadata
      import('@/integrations/supabase/client').then(({ supabase }) => {
        supabase
          .from('projects')
          .select('metadata')
          .eq('id', projectId)
          .single()
          .then(({ data }) => setProjectMeta(data?.metadata || {}));
      });
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedStep === null) {
      setSelectedStep("Project Brief");
    }
  }, [selectedStep]);

  // Function to change the selected step - can be used by other components
  const changeStep = (step: string) => {
    setSelectedStep(step);
  };

  // Context value
  const contextValue: StepNavigationContextType = {
    changeStep,
    selectedStep,
  };

  // Determine if this is a new project (no projectId in URL)
  const isNewProject = !projectId;

  return (
    <StepNavigationContext.Provider value={contextValue}>
      <nav
        className="flex items-center bg-white font-sans text-[14px] pr-2 overflow-x-auto scrollbar-hide"
        style={{ lineHeight: '22px', height: 60, WebkitOverflowScrolling: 'touch' }}
      >
        {designThinkingSteps.map((step) => {
          const isSelected = selectedStep === step.label;
          const isProjectBrief = step.label === "Project Brief";
          const isEmpathize = step.label === "Empathize";
          let isDisabled = false;
          if (isNewProject && !isProjectBrief) isDisabled = true;
          if (!isProjectBrief && !isEmpathize) isDisabled = true;
          if (step.label === "Define" && projectMeta.isComplete) isDisabled = false;
          if (step.label === "Ideate" && projectMeta.isCompleteDefine) isDisabled = false;
          if (step.label === "Prototype" && projectMeta.isCompleteIdeate) isDisabled = false;
          if (step.label === "Test" && projectMeta.isCompletePrototype) isDisabled = false;
          if (step.label === "Implement" && projectMeta.isCompleteTest) isDisabled = false;
          if (step.label === "Measure" && projectMeta.isCompleteImplement) isDisabled = false;

          return (
            <button
              key={step.label}
              onClick={() => {
                if (!isDisabled) setSelectedStep(step.label);
              }}
              disabled={isDisabled}
              className={`flex-shrink-0 flex-1 min-w-[48px] sm:min-w-[100px] bg-white py-0 px-0 h-full font-medium focus:outline-none flex items-center justify-center transition-colors ${isSelected ? 'text-[#393CA0FF]' : 'text-[#565D6D]'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F4F4FB]'}`}
              style={{
                height: '100%',
                padding: '26px 0',
                borderRadius: 0,
                borderBottom: isSelected ? '4px solid #393CA0FF' : '4px solid transparent',
                fontWeight: 500,
              }}
            >
              <img src={step.icon} alt="" width={20} height={20} className="sm:mr-2" style={{ opacity: isDisabled ? 0.5 : 1 }} />
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </nav>
      <div>
        {selectedStep === "Project Brief" && (
          <ProjectBrief onBack={() => {
            if (onBackToProjects) {
              onBackToProjects();
            } else {
              setSelectedStep(null);
            }
          }} />
        )}
        {selectedStep === "Empathize" && !isNewProject && (
          <Empathize />
        )}
        {selectedStep === "Define" && !isNewProject && (
          <Define />
        )}
        {selectedStep === "Ideate" && !isNewProject && (
          <Ideate />
        )}
        {selectedStep === "Test" && !isNewProject && (
          <Test />
        )}
        {selectedStep === "Prototype" && !isNewProject && (
          <Prototype />
        )}
        {selectedStep === 'Implement' && !isNewProject && <Implement inNavBar={true} />}
        {selectedStep === 'Measure' && !isNewProject && <Measure inNavBar={true} />}
      </div>
    </StepNavigationContext.Provider>
  );
} 