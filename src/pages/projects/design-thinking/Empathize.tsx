import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepCard from "../../../components/projects/StepCard";
import DocumentEditor from "../../../components/projects/DocumentEditor"; 
import Define from "./Define";

const steps = [
  {
    title: "Select your user research method",
    description: "Choose the best method to gather insights and understand your users deeply",
    options: ["User interviews", "Surveys", "Focused Groups"],
    duration: null,
    action: { label: "Recommend", active: true },
  },
  {
    title: "Create a user research plan",
    description: "Develop a comprehensive plan to guide your research efforts effectively",
    options: null,
    duration: "4 hours",
    action: { label: "Generate", active: true },
  },
  {
    title: "Conduct user research",
    description: "Execute your research plan to collect valuable data from your users",
    options: null,
    duration: "1 - 2 weeks",
    action: { label: "Upload notes", active: false },
  },
  {
    title: "Generate insights from your user research",
    description: "Analyze the gathered data to uncover actionable insights",
    options: null,
    duration: "2 days",
    action: { label: "Analyze", active: false },
  },
  {
    title: "Create customer persona/s",
    description: "Come up with a visual representation of the people you are designing for",
    options: null,
    duration: "30 mins",
    action: { label: "Generate", active: false },
  },
];

export default function Empathize() {
  const [activeStep, setActiveStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState([false, false, false, false, false]);
  const [showDefine, setShowDefine] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState([false, false, false]);
  const navigate = useNavigate();

  const handleOptionCheck = (optionIdx: number) => {
    setCheckedOptions(prev => {
      const updated = [...prev];
      updated[optionIdx] = !updated[optionIdx];
      return updated;
    });
  };

  const handleCheck = (idx: number) => {
    if (idx === 0 && !checkedOptions.some(Boolean)) {
      return;
    }
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
      setShowDefine(true);
    } else if (checkedSteps[activeStep] && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  if (showDefine) {
    return <Define />;
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-6 pl-6 pb-11">
      {/* Left: Stepper + Cards */}
      <div className="w-full md:w-3/5 flex flex-col mt-8">
        <h1 className="text-3xl font-bold text-[#23262F] mb-1">Empathize</h1>
        <p className="text-[#565D6D] mb-8 text-[15px]">Begin your innovation journey by deeply understanding your users</p>
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
                  optionChecked={idx === 0 ? checkedOptions : undefined}
                  onOptionCheck={idx === 0 ? handleOptionCheck : undefined}
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
      {/* Right: Document editor */}
      <div className="w-full md:w-1/2 bg-white shadow p-8 h-[90vh] overflow-auto">
        <DocumentEditor />
      </div>
    </div>
  );
}
