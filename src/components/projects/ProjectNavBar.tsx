import React, { useState, useEffect } from 'react';
import ProjectBrief from '../../pages/projects/project-brief/ProjectBrief';
import ProjectTest from '../../pages/projects/project-test/ProjectTest';
import ProjectImplement from '../../pages/projects/project-implement/ProjectImplement';
import ProjectMeasure from '../../pages/projects/project-measure/ProjectMeasure';

const designThinkingSteps = [
  { label: 'Project Brief', icon: '/projects-navbar-icons/paper.svg' },
  { label: 'Empathize', icon: '/projects-navbar-icons/heart.svg' },
  { label: 'Define', icon: '/projects-navbar-icons/resize.svg' },
  { label: 'Ideate', icon: '/projects-navbar-icons/lightbulb.svg' },
  { label: 'Prototype', icon: '/projects-navbar-icons/shape.svg' },
  { label: 'Test', icon: '/projects-navbar-icons/paper-airplane.svg' },
  { label: 'Implement', icon: '/projects-navbar-icons/todo.svg' },
  { label: 'Measure', icon: '/projects-navbar-icons/ruler.svg' },
];

interface ProjectNavBarProps {
  onBackToProjects?: () => void;
}

export function ProjectNavBar({ onBackToProjects }: ProjectNavBarProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStep === null) {
      setSelectedStep('Project Brief');
    }
  }, [selectedStep]);

  return (
    <>
      <nav
        className="flex items-center justify-between bg-white font-sans text-[14px] pr-2"
        style={{ lineHeight: '22px', height: 60 }}
      >
        {designThinkingSteps.map(step => {
          const isSelected = selectedStep === step.label;
          return (
            <button
              key={step.label}
              onClick={() => setSelectedStep(step.label)}
              className={`flex-1 bg-white py-0 px-0 h-full font-medium focus:outline-none hover:bg-[#F4F4FB] transition-colors flex items-center justify-center ${
                isSelected ? 'text-[#393CA0FF]' : 'text-[#565D6D]'
              }`}
              style={{
                height: '100%',
                padding: '26px 0',
                borderRadius: 0,
                borderBottom: isSelected
                  ? '4px solid #393CA0FF'
                  : '4px solid transparent',
                fontWeight: 500,
              }}
            >
              <img
                src={step.icon}
                alt=""
                width={20}
                height={20}
                style={{ marginRight: 8 }}
              />
              {step.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-8">
        {selectedStep === 'Project Brief' && (
          <ProjectBrief
            onBack={() => {
              if (onBackToProjects) {
                onBackToProjects();
              } else {
                setSelectedStep(null);
              }
            }}
          />
        )}
        {selectedStep === 'Test' && (
          <ProjectTest
            inNavBar={true}
            onBack={() => setSelectedStep('Test')}
          />
        )}
        {selectedStep === 'Implement' && <ProjectImplement inNavBar={true} />}
        {selectedStep === 'Measure' && <ProjectMeasure inNavBar={true} />}
      </div>
    </>
  );
}
