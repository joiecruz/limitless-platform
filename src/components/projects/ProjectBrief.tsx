import React, { useState } from "react";
import ProjectBriefProgressBar from "./ProjectBriefProgressBar";

export default function ProjectBrief({ onBack }: { onBack?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className="w-full flex flex-col items-center justify-center mt-12 ml-5">
      {/* Top Row: Back Button and Progress Bar */}
      <div className="w-full flex items-center mb-8 relative" style={{ margin: '0 auto' }}>
        {currentStep === 0 && (
          <button
            onClick={onBack}
            className="flex items-center bg-[#F4F4FB] rounded-[5px] px-2 pr-4 py-2 text-[#393CA0FF] font-sans hover:bg-[#C1C2E9FF] transition-colors ml-9 absolute left-0"
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
          <h2 className="font-semibold text-center font-sans text-[35px] mb-4 mt-8">Create an Innovation Project</h2>
          {currentStep === 0 && (
            <div className="mt-1.5 bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-start" style={{ width: '70vw', height: '52vh' }}>
              <div className="flex items-center mb-6">
                <img src="/projects-navbar-icons/info-circle.svg" alt="Info" width={30} height={23} style={{ marginRight: 13, color: '#2FD5C8', filter: 'invert(62%) sepia(99%) saturate(377%) hue-rotate(127deg) brightness(97%) contrast(92%)' }} />
                <span className="text-[22px] font-bold font-sans" style={{ color: '#1E2128FF' }}>Overview</span>
              </div>
              <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="project-name">Project Name</label>
              <input
                id="project-name"
                type="text"
                placeholder="What is the name of your project?"
                className="w-full rounded-[10px] border border-gray-200 font-medium  px-4 py-3 text-[16px] h-[40px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
                style={{ marginBottom: 16 }}
              />

              <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="project-description">Project Description</label>
              <input
                id="project-description"
                type="text"
                placeholder="Provide a summary of your project goals and objectives."
                className="w-full rounded-[10px] border border-gray-200 font-medium px-4 py-3 text-[16px] h-[130px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
                style={{ marginBottom: 16 }}
              />

              <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="project-problem">Problem or Opportunity</label>
              <input
                id="project-problem"
                type="text"
                placeholder="Describe the problem the project aims to solve or the opportunity it seeks to leverage."
                className="w-full rounded-[10px] border border-gray-200 font-medium px-4 py-3 text-[16px] h-[130px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
                style={{ marginBottom: 16 }}
              />

              <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="project-customers">Target customers or audience</label>
              <input
                id="project-customers"
                type="text"
                placeholder="Identify the primary audience or beneficiaries of the project"
                className="w-full rounded-[10px] border border-gray-200 font-medium px-4 py-3 text-[16px] h-[40px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
                style={{ marginBottom: 16 }}
              />
            </div>
          )}
          <div className="flex justify-end" style={{ width: '70vw' }}>
            <button
              type="button"
              className="mt-6 bg-[#393CA0FF] hover:bg-[#2C2E7AFF] text-white font-bold py-3 rounded-[3px] text-[18px] transition-colors px-8 w-[145px] font-sans"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 2))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 