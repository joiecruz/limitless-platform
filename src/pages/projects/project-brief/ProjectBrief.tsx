import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { projectId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);  
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingSave, setPendingSave] = useState(false);

  const navigate = useNavigate();
  const overviewRef = useRef<ProjectOverviewRef>(null);
  const successCriteriaRef = useRef<ProjectSuccessCriteriaRef>(null);
  const timelineRef = useRef<ProjectTimelineRef>(null);
  const { toast } = useToast();
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { data, isLoading, saveProjectBrief, updateData, refetch, loadProjectBrief } = useProjectBrief(currentWorkspace?.id || null);

  const handleStepChange = (newStep: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsTransitioning(false);
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
        setPendingSave(true);
        handleStepChange(Math.min(currentStep + 1, 5));
        return;
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
        setPendingSave(true);
        handleStepChange(Math.min(currentStep + 1, 5));
        return;
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
        setPendingSave(true);
        handleStepChange(Math.min(currentStep + 1, 5));
        return;
      }
    }

    // If not handled above, just move to next step
    handleStepChange(Math.min(currentStep + 1, 5));
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate("/dashboard/projects");
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // Automatically reload saved content on mount or workspace change
  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, [currentWorkspace?.id]);

  // Load saved data into forms when step changes
  useEffect(() => {
    // console.log('Current Step:', currentStep);
    // console.log('ProjectBrief data:', data);
    if (overviewRef.current) {
      // console.log('Calling overviewRef.current.setValues with:', {
      //   name: data.name,
      //   description: data.description,
      //   problem: data.problem,
      //   customers: data.customers
      // });
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
    if (timelineRef.current && (data.startDate || teamMembers.length > 0)) {
      timelineRef.current.setValues({
        startDate: data.startDate,
        endDate: data.endDate,
        teamMembers: data.teamMembers,
      });
    }
  }, [currentStep, data, teamMembers]);

  useEffect(() => {
    if (projectId) {
      loadProjectBrief(projectId).then(() => {
        // console.log('[ProjectBrief] Loaded project brief data:', data);
      });
    }
    // eslint-disable-next-line
  }, [projectId]);

  // Update teamMembers state when data.teamMembers changes (from DB)
  useEffect(() => {
    if (data.teamMembers && Array.isArray(data.teamMembers)) {
      setTeamMembers(data.teamMembers);
    }
  }, [data.teamMembers]);

  // Save to database after state is updated
  useEffect(() => {
    if (pendingSave) {
      saveProjectBrief().finally(() => setPendingSave(false));
    }
    // eslint-disable-next-line
  }, [data]);

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
            {currentStep === 0 && (
              <ProjectOverview ref={overviewRef} />
            )}
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
                projectData={{
                  name: data.name || "Innovation Project",
                  description: data.description || "An innovative solution to address current challenges",
                  problem: data.problem || "A challenge that needs to be addressed",
                  customers: data.customers || "Target audience",
                  targetOutcomes: data.targetOutcomes || "Positive impact and meaningful change",
                  sdgs: data.sdgs || [],
                  innovationTypes: data.innovationTypes || []
                }}
                onSubmit={async (selectedChallenge) => {
                  try {
                    // Update project with selected design challenge
                    updateData({ designChallenge: selectedChallenge } as any);
                    await saveProjectBrief();
                    
                    toast({
                      title: "Success",
                      description: "Design challenge saved successfully! Your project is now ready.",
                    });
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
          <div>
            {currentStep > 0 && currentStep < 3 && (
              <div className="flex justify-end gap-4" style={{ width: '55vw' }}>
                <button
                  type="button"
                  className="mt-5 bg-[#9095A1FF] text-white font-semibold py-2 rounded-[3px] text-[13px] transition-colors px-8 w-[115px] font-sans hover bg-[2565D6DFF] "
                  onClick={() => handleStepChange(Math.max(currentStep - 1, 0))}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="mt-5 bg-[#393CA0FF] text-white font-semibold py-2 rounded-[3px] hover:bg-[#2C2E7AFF] text-[13px] transition-colors px-8 w-[115px] font-sans"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}
            {currentStep < 3 && currentStep === 0 && (
              <div className="flex justify-end gap-4" style={{ width: '55vw' }}>
                <button
                  type="button"
                  className="mt-5 bg-[#393CA0FF] text-white font-semibold py-2 rounded-[3px] hover:bg-[#2C2E7AFF] text-[13px] transition-colors px-8 w-[115px] font-sans"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex justify-center" style={{ width: '55vw' }}>
                <button className="mt-[-33px] bg-[#393CA0] hover:bg-[#2C2E7A] text-white font-semibold py-2 rounded-[6px] text-[15px] w-[150px] h-[40px] font-sans transition-colors flex items-center justify-center gap-1" 
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
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="h-[5vh]"></div>
    </div>
  );
} 