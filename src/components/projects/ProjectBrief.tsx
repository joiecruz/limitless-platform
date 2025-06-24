import React from "react";
import ProjectBriefProgressBar from "./ProjectBriefProgressBar";

export default function ProjectBrief({ onBack }: { onBack?: () => void }) {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-12 ml-5">
      {/* Top Row: Back Button and Progress Bar */}
      <div className="w-full flex items-center mb-8 relative" style={{ margin: '0 auto' }}>
        <button
          onClick={onBack}
          className="flex items-center bg-[#F4F4FB] rounded-[5px] px-2 pr-4 py-2 text-[#393CA0FF] font-sans hover:bg-[#C1C2E9FF] transition-colors ml-9 absolute left-0"
          style={{ fontWeight: 400, fontSize: 16 }}
        >
          <img src="/projects-navbar-icons/back-arrow.svg" alt="Back" width={18} height={24} className="mr-2" />
          Back
        </button>
        {/* Progress Bar */}
        <div className="flex-1 flex justify-center">
          <ProjectBriefProgressBar />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full flex flex-col items-center">
          <h2 className="font-semibold text-center font-sans text-[35px] mb-4 mt-8">Create an Innovation Project</h2>
          <div className="mt-1.5 bg-white rounded-xl border border-gray-100 p-8" style={{ width: '70vw', height: 800 }}>
            <div className="text-center text-gray-400">Project Brief Content </div>
          </div>
        </div>
      </div>
    </div>
  );
} 