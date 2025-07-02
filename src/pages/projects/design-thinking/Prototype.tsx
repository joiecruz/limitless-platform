import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepCard from "../../../components/projects/StepCard";
import DocumentEditor from "../../../components/projects/DocumentEditor";
import UploadPrototype from '../../../components/projects/UploadPrototype';
import Define from "./Define";

const steps = [
  {
    title: "Choose your prototype type",
    description: "Transform your ideas into something tangible using these prototyping techniques. Select up to 3 below.",
    options: null,
    duration: "30 mins",
    action: { label: "Recommend", active: true },
  },
  {
    title: "Work on your prototype",
    description: "Collaborate with your team to select the most impactful 'How Might We' questions to carry forward into ideation",
    options: null,
    duration: "4 hours to 3 days",
    action: { label: "Upload photos", active: true },
  }
];

const actionButtons = [
    { label: 'Sketches', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Paper Prototypes', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 4h8v8H4z" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Role Playing', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Physical Prototype', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="4" y="4" width="8" height="8" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'High-Fidelity Mockups', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="8" rx="2" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Journey Map', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 8c2-4 10 4 12-4" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Wireframes', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Others', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#393CA0" strokeWidth="1.5"/><text x="5" y="12" fontSize="7" fill="#393CA0">...</text></svg> },
];

export default function Prototype() {
  const [activeStep, setActiveStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState(Array(steps.length).fill(false));
  const [showDefine, setShowDefine] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState([false, false, false]);
  const [selectedActions, setSelectedActions] = useState(Array(actionButtons.length).fill(false));
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

  const handleActionSelect = (idx: number) => {
    setSelectedActions(prev => {
      const count = prev.filter(Boolean).length;
      const updated = [...prev];
      if (updated[idx]) {
        updated[idx] = false;
      } else if (count < 3) {
        updated[idx] = true;
      }
      // After updating, check if at least one is selected
      const anySelected = updated.some(Boolean);
      setCheckedSteps(cs => {
        const csUpdated = [...cs];
        const wasChecked = cs[0];
        csUpdated[0] = anySelected;
        // Move to next step if just checked and on the active step
        if (anySelected && !wasChecked && activeStep === 0 && steps.length > 1) {
          setActiveStep(1);
        }
        return csUpdated;
      });
      return updated;
    });
  };

  const allChecked = checkedSteps.every(Boolean);
  const isLastStep = activeStep === steps.length - 1;
  const canGoNext = isLastStep ? allChecked : checkedSteps[activeStep];

  const canCheckStep = (idx: number) => {
    if (idx === 0) {
      return selectedActions.some(Boolean);
    }
    return activeStep === idx;
  };

  const handleNext = () => {
    if (isLastStep && allChecked) {
      // TODO: Add logic to navigate to the next step
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
        <h1 className="text-3xl font-bold text-[#23262F] mb-1">Prototype</h1>
        <p className="text-[#565D6D] mb-8 text-[15px]">Bring your chosen ideas to life</p>
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
                      height: 'calc(70% + 1rem)',
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
                  canCheck={canCheckStep(idx)}
                  optionChecked={idx === 0 ? checkedOptions : undefined}
                  onOptionCheck={idx === 0 ? handleOptionCheck : undefined}
                  actions={idx === 0 ? actionButtons : undefined}
                  actionSelected={idx === 0 ? selectedActions : undefined}
                  onActionSelect={idx === 0 ? handleActionSelect : undefined}
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
      {/* Right: Document editor or UploadPrototype */}
      <div className="w-full md:w-1/2 bg-white shadow h-[90vh] overflow-auto">
        {activeStep === 1 ? <UploadPrototype /> : <DocumentEditor className="p-8" />}
      </div>
    </div>
  );
}
