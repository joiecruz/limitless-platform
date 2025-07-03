import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectBriefProgressBar from "../../../components/projects/ProjectBriefProgressBar";
import ProjectOverview, { ProjectOverviewRef } from "./ProjectOverview";
import ProjectSuccessCriteria, { ProjectSuccessCriteriaRef } from "./ProjectSuccessCriteria";
import ProjectTimeline, { ProjectTimelineRef } from "./ProjectTimeline";
import ProjectSubmission from "./ProjectSubmission";
import ProjectDesignChallenge from "./ProjectDesignChallenges";
import { useToast } from "../../../hooks/use-toast";
import { useProjectBrief } from "@/hooks/useProjectBrief";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";

export default function ProjectBrief({ onBack }: { onBack?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const overviewRef = useRef<ProjectOverviewRef>(null);
  const successCriteriaRef = useRef<ProjectSuccessCriteriaRef>(null);
  const timelineRef = useRef<ProjectTimelineRef>(null);
  const { toast } = useToast();
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { data, isLoading, saveProjectBrief, updateData } = useProjectBrief(currentWorkspace?.id || null);

  console.log('ProjectBrief rendered with currentStep:', currentStep);

  const handleStepChange = (newStep: number) => {
    console.log('Changing step from', currentStep, 'to', newStep);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsTransitioning(false);
      console.log('Step changed to:', newStep);
    }, 300); // 300ms fade out duration
  };

  const handleNext = async () => {
    let currentStepData;
    
    // Validate and get data from current step
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
        currentStepData = overviewRef.current.getValues();
        updateData(currentStepData);
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
        currentStepData = successCriteriaRef.current.getValues();
        updateData(currentStepData);
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
        currentStepData = timelineRef.current.getValues();
        updateData(currentStepData);
      }
    }

    // Save to database before moving to next step
    if (currentStep < 3) {
      try {
        await saveProjectBrief();
      } catch (error) {
        // Don't block progression if save fails, just warn
        toast({
          title: "Warning",
          description: "Form data saved locally. Will sync when possible.",
          variant: "default"
        });
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

  // Load saved data into forms when step changes
  useEffect(() => {
    if (overviewRef.current && data.name) {
      overviewRef.current.setValues({
        name: data.name,
        description: data.description,
        problem: data.problem,
        customers: data.customers
      });
    }
    if (successCriteriaRef.current && data.targetOutcomes) {
      successCriteriaRef.current.setValues({
        targetOutcomes: data.targetOutcomes,
        sdgs: data.sdgs,
        innovationTypes: data.innovationTypes
      });
    }
    if (timelineRef.current && (data.startDate || data.teamMembers.length > 0)) {
      timelineRef.current.setValues({
        startDate: data.startDate,
        endDate: data.endDate,
        teamMembers: data.teamMembers
      });
    }
  }, [currentStep, data]);

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
            {currentStep === 1 && (
              <ProjectSuccessCriteria 
                ref={successCriteriaRef} 
                projectName={data.name}
                projectDescription={data.description}
                projectProblem={data.problem}
                projectCustomers={data.customers}
              />
            )}
            {currentStep === 2 && <ProjectTimeline ref={timelineRef} />}
            {currentStep === 3 && <ProjectSubmission onNext={() => handleStepChange(4)} />}
            {currentStep === 4 && (
              <ProjectDesignChallenge 
                projectData={data}
                onSubmit={async (selectedChallenge) => {
                  try {
                    // Update project with selected design challenge
                    updateData({ designChallenge: selectedChallenge } as any);
                    await saveProjectBrief();
                    
                    toast({
                      title: "Success",
                      description: "Design challenge saved successfully! Your project is now ready.",
                    });
                    
                    // Wait a moment then navigate back to projects
                    setTimeout(() => {
                      navigate("/dashboard/projects");
                    }, 1500);
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to save design challenge",
                      variant: "destructive",
                    });
                  }
                }}
              />
            )}
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
        </div>
      </div>
      
      <div className="h-[5vh]"></div>
    </div>
  );
} 