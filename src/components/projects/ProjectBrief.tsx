import React, { useState } from "react";
import ProjectBriefProgressBar from "./ProjectBriefProgressBar";
import ProjectOverview from "./project-brief/ProjectOverview";
import ProjectSuccessCriteria from "./project-brief/ProjectSuccessCriteria";
import ProjectTimeline from "./project-brief/ProjectTimeline";
import ProjectSubmission from "./project-brief/ProjectSubmission";

export default function ProjectBrief({ onBack }: { onBack?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStepChange = (newStep: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsTransitioning(false);
    }, 300); // 300ms fade out duration
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-12 ml-5">
      {/* Top Row: Back Button and Progress Bar */}
      <div className="w-full flex items-center mb-8 relative" style={{ margin: '0 auto' }}>
        {currentStep == 0 && (
          <button
            onClick={onBack}
            className="flex items-center bg-[#F4F4FB] rounded-[10px] px-2 pr-4 py-2 text-[#393CA0FF] font-sans hover:bg-[#C1C2E9FF] transition-colors ml-9 absolute left-0"
            style={{ fontWeight: 400, fontSize: 16 }}
          >
            <img src="/projects-navbar-icons/back-arrow.svg" alt="Back" width={18} height={24} className="mr-2" />
            Back
          </button>
        )}
        { currentStep != 0 && (
            <button
            onClick={() => handleStepChange(Math.max(currentStep - 1, 0))}
            className="flex items-center bg-[#F4F4FB] rounded-[10px] px-2 pr-4 py-2 text-[#393CA0FF] font-sans hover:bg-[#C1C2E9FF] transition-colors ml-9 absolute left-0"
            style={{ fontWeight: 400, fontSize: 16 }}
          >
            <img src="/projects-navbar-icons/back-arrow.svg" alt="Back" width={18} height={24} className="mr-2" />
            Back
          </button>
        )}
        {/* Progress Bar */}
        <div className="flex-1 flex justify-center">
          <ProjectBriefProgressBar currentStep={currentStep} />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full flex flex-col items-center">
            {currentStep < 3 && (
                <h2 className="font-semibold text-center font-sans text-[35px] mb-4 mt-8">Create an Innovation Project</h2>
            )}
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {currentStep === 0 && <ProjectOverview />}
            {currentStep === 1 && <ProjectSuccessCriteria />}
            {currentStep === 2 && <ProjectTimeline />}
            {currentStep === 3 && <ProjectSubmission />}
          </div>
          <div className="flex justify-end gap-4" style={{ width: '60vw' }}>
            {currentStep > 0 && currentStep < 3 && (
              <button
                type="button"
                className="mt-6 bg-[#9095A1FF] text-white font-bold py-3 rounded-[3px] text-[18px] transition-colors px-8 w-[145px] font-sans hover:bg-[#565D6DFF]"
                onClick={() => handleStepChange(Math.max(currentStep - 1, 0))}
              >
                Back
              </button>
            )}
            {currentStep < 3 && (
                <button
              type="button"
              className="mt-6 bg-[#393CA0FF] hover:bg-[#2C2E7AFF] text-white font-bold py-3 rounded-[3px] text-[18px] transition-colors px-8 w-[145px] font-sans"
              onClick={() => handleStepChange(Math.min(currentStep + 1, 3))}
            >
              Next
            </button>
            )}
          </div>
        </div>
      </div>
      <div className="h-[5vh]"></div>
    </div>
  );
} 