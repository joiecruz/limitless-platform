import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepCard from "../../../components/projects/StepCard";
import DocumentEditor from "../../../components/projects/DocumentEditor";
import HowMightWe from "../../../components/projects/HowMightWe";
import { useStepNavigation } from "../../../components/projects/ProjectNavBar";

const steps = [
  {
    title: "Review main insights",
    description: "Analyze the insights gathered during the Empathize phase. Identify key themes and patterns that stand out.",
    options: null,
    duration: "2 hours",
    action: { label: "Analyze", active: true },
  },
  {
    title: "Reframe your design challenge",
    description: "Work with your team to develop new 'How Might We' questions based on your persona and insights",
    options: null,
    duration: "30 mins",
    action: { label: "Generate", active: true },
  },
  {
    title: "Select your new design challenge",
    description: "Collaborate with your team to select the most impactful 'How Might We' questions to carry forward into ideation",
    options: null,
    duration: "15 mins",
    action: { label: "Create notes", active: false },
  }
];

export default function Define() {
  const [activeStep, setActiveStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState(Array(steps.length).fill(false));
  const navigate = useNavigate();
  const { changeStep } = useStepNavigation();

  const handleCheck = (idx: number) => {
    if (idx === activeStep) {
      const newChecked = [...checkedSteps];
      newChecked[idx] = !newChecked[idx]; // toggle
      setCheckedSteps(newChecked);
      if (!checkedSteps[idx] && idx < steps.length - 1) {
        // If just checked (was false, now true), move to next step
        setActiveStep(idx + 1);
      }
    }
  };

  const allChecked = checkedSteps.every(Boolean);
  const isLastStep = activeStep === steps.length - 1;
  const canGoNext = isLastStep ? allChecked : checkedSteps[activeStep];

  const handleNext = () => {
    if (isLastStep && allChecked) {
      // Navigate to the next design thinking step (Ideate)
      changeStep("Ideate");
    } else if (checkedSteps[activeStep] && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 pl-6 pb-11">
      {/* Left: Stepper + Cards */}
      <div className="w-full flex flex-col mt-8">
        <h1 className="text-3xl font-bold text-[#23262F] mb-1">Define</h1>
        <p className="text-[#565D6D] mb-8 text-[15px]">Reframe your design challenge using the insights you gathered</p>
        <div className="flex flex-col gap-4">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex flex-row items-stretch">
              {/* Stepper: circle and line */}
              <div className="relative flex flex-col items-center mr-6" style={{ width: 40 }}>
                <div className="flex items-center h-full">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-[1px] text-s ${activeStep === idx ? 'border-[#DADAF2] bg-[#DADAF2]' : 'border-[#D1D5DB] bg-white'}  z-10`}>
                    <span className='text-[#171A1F]'>{idx + 1}</span>
                  </div>
                </div>
                {/* Line below the circle, except for last step */}
                {!(idx === steps.length - 1) && (
                  <div
                    className="absolute left-1/2"
                    style={{
                      top: '50%',
                      transform: 'translateX(-50%)',
                      width: '2px',
                      height: 'calc(100% + 1rem)',
                      background: '#E5E7EB',
                      zIndex: 0,
                    }}
                  />
                )}
              </div>
              {/* Card */}
              <div className="flex-1">
                <StepCard
                  {...step}
                  active={activeStep === idx}
                  checked={checkedSteps[idx]}
                  onCheck={() => handleCheck(idx)}
                  canCheck={activeStep === idx}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Navigation buttons */}
        <div className="flex justify-end mt-8 gap-2">
          {activeStep > 0 && (
            <button
              className="px-8 py-2 rounded-[3px] bg-[#9095A1] text-white font-medium disabled:opacity-50 w-[120px]"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          <button
            className="px-8 py-2 rounded-[3px] bg-[#393CA0] text-white font-medium disabled:opacity-50 w-[120px]"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            Next
          </button>
        </div>
      </div>
      {/* Right: Document editor or HowMightWe */}
      <div className="w-full bg-white shadow h-[100vh] overflow-auto">
        {(activeStep === 1 || activeStep === 2) ? <HowMightWe /> : <DocumentEditor className="p-2" />}
      </div>
    </div>
  );
}
