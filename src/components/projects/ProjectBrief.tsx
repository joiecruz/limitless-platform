import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProjectBriefProgressBar from "./ProjectBriefProgressBar";
import ProjectOverview, { ProjectOverviewRef } from "./project-brief/ProjectOverview";
import ProjectSuccessCriteria from "./project-brief/ProjectSuccessCriteria";
import ProjectTimeline, { ProjectTimelineRef } from "./project-brief/ProjectTimeline";
import ProjectSubmission from "./project-brief/ProjectSubmission";
import ProjectDesignChallenge from "./project-brief/ProjectDesignChallenges";
import { useToast } from "../../hooks/use-toast";

export default function ProjectBrief({ onBack }: { onBack?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const overviewRef = useRef<ProjectOverviewRef>(null);
  const successCriteriaRef = useRef<any>(null);
  const timelineRef = useRef<ProjectTimelineRef>(null);
  const { toast } = useToast();

  const handleStepChange = (newStep: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsTransitioning(false);
    }, 300); // 300ms fade out duration
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (overviewRef.current) {
        const result = overviewRef.current.validate();
        if (result !== true) {
          toast({
            title: "Form Error",
            description: result,
            variant: "destructive"
          });
          return;
        }
      }
    }
    if (currentStep === 1) {
      if (successCriteriaRef.current) {
        const result = successCriteriaRef.current.validate();
        if (result !== true) {
          toast({
            title: "Form Error",
            description: result,
            variant: "destructive"
          });
          return;
        }
      }
    }
    if (currentStep === 2) {
      if (timelineRef.current) {
        const result = timelineRef.current.validate();
        if (result !== true) {
          toast({
            title: "Form Error",
            description: result,
            variant: "destructive"
          });
          return;
        }
      }
    }
    handleStepChange(Math.min(currentStep + 1, 5));
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate("/dashboard/projects");
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-7 ml-5">
      {/* Top Row: Back Button and Progress Bar */}
      <div className="w-full flex items-center mb-8 relative" style={{ margin: '0 auto' }}>
        {currentStep == 0 && (
          <button
            onClick={handleBack}
            className="flex items-center bg-[#F4F4FB] rounded-[10px] px-2 pr-3 py-[6px] text-[#393CA0FF] font-sans hover:bg-[#C1C2E9FF] transition-colors ml-6 absolute left-0"
            style={{ fontWeight: 400, fontSize: 13 }}
          >
            <img src="/projects-navbar-icons/back-arrow.svg" alt="Back" width={15} height={15} className="mr-2" />
            Back
          </button>
        )}
        { currentStep != 0 && currentStep < 4 && (
            <button
            onClick={() => handleStepChange(Math.max(currentStep - 1, 0))}
            className="flex items-center bg-[#F4F4FB] rounded-[10px] px-2 pr-3 py-[6px] text-[#393CA0FF] font-sans hover:bg-[#C1C2E9FF] transition-colors ml-6 absolute left-0"
            style={{ fontWeight: 400, fontSize: 13 }}
          >
            <img src="/projects-navbar-icons/back-arrow.svg" alt="Back" width={15} height={15} className="mr-2" />
            Back
          </button>
        )}
        {/* Progress Bar */}
        {currentStep < 4 && (
            <div className="flex-1 flex justify-center">
          <ProjectBriefProgressBar currentStep={currentStep} />
        </div>
        )}
        </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
            {currentStep < 3 && (
                <h2 className="font-bold text-center font-sans text-[24px] mb-2 mt-5">Create an Innovation Project</h2>
            )}
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {currentStep === 0 && <ProjectOverview ref={overviewRef} />}
            {currentStep === 1 && <ProjectSuccessCriteria ref={successCriteriaRef} />}
            {currentStep === 2 && <ProjectTimeline ref={timelineRef} />}
            {currentStep === 3 && <ProjectSubmission />}
            {currentStep === 4 && <ProjectDesignChallenge />}
          </div>
          <div className="flex justify-end gap-4" style={{ width: '55vw' }}>
            {currentStep > 0 && currentStep < 3 && (
              <button
                type="button"
                className="mt-5 bg-[#9095A1FF] text-white font-semibold py-2 rounded-[3px] text-[13px] transition-colors px-8 w-[115px] font-sans hover bg-[2565D6DFF] "
                onClick={() => handleStepChange(Math.max(currentStep - 1, 0))}
              >
                Back
              </button>
            )}
            {currentStep < 3 && (
                <button
              type="button"
              className="mt-5 bg-[#393CA0FF] text-white font-semibold py-2 rounded-[3px] hover:bg-[#2C2E7AFF] text-[13px] transition-colors px-8 w-[115px] font-sans"
              onClick={handleNext}
            >
              Next
            </button>
            )}
            
          </div>
          {/* Next Button */}
          {currentStep === 3 && (
            <button className="mt-[-28px] bg-[#393CA0] hover:bg-[#2C2E7A] text-white font-semibold py-2 rounded-[6px] text-[15px] w-[150px] h-[40px] font-sans transition-colors flex items-center justify-center gap-1" 
            onClick={() => handleStepChange(Math.min(currentStep + 1, 5))} >
            <img
                src="/projects-navbar-icons/sparkle.svg"
                alt=""
                width={15}
                height={15}
                style={{ marginRight: 2, marginLeft: -5, color: 'white' }}
                />
                Next
            </button>
          )}
        </div>
      </div>
      
      <div className="h-[5vh]"></div>
    </div>
  );
} 