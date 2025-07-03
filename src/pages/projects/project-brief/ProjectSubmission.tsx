import React from "react";

export default function ProjectSubmission() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      {/* Checkmark Circle */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-17 h-17 rounded-full border-[3px] border-[#ADAED7] flex items-center justify-center relative bg-white p-[2px]">
          <svg width="70" height="70" viewBox="0 0 36 36" className="block">
            <circle cx="18" cy="18" r="17" fill="#E4E6F1" stroke="#E4E6F1" strokeWidth="2" />
            <polyline points="12,18 17,23 24,13" fill="none" stroke="#393CA0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* Heading */}
      <h2 className="text-[22px] font-bold text-center text-gray-800 mb-6">Great job, you've submitted<br />your project brief!</h2>
      {/* Subheading */}
      <p className="text-center text-[15px] text-gray-500 mb-6 max-w-xl">
        Our AI is now working on generating design challenges tailored to your needs based on the information you provided.
      </p>
      {/* Info Box */}
      <div className="bg-white border border-gray-200 rounded-[6px] px-5 py-4 mb-6 mt-2 max-w-xl w-full flex items-start gap-0">
        <img src="/projects-navbar-icons/info-i.svg" alt="Info" width={21} height={21} style={{ marginRight: 13, color: '#374151' }} />
        <div>
          <div className="font-bold text-[14px] text-[#374151] mb-1">What is a design challenge?</div>
          <div className="text-gray-600 text-[13px]">A design challenge is a statement, usually starting with the phrase, "How might we..." outlines the problem you want to solve, guiding your team throughout the innovation process.</div>
        </div>
      </div>
      
    </div>
  );
}
