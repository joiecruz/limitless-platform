import React from "react";

export default function ProjectSubmission() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      {/* Checkmark Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-[#E4E6F1] flex items-center justify-center relative">
          <svg width="36" height="36" viewBox="0 0 36 36" className="absolute top-1 left-1">
            <circle cx="18" cy="18" r="17" fill="none" stroke="#E4E6F1" strokeWidth="2" />
            <polyline points="10,19 16,25 26,13" fill="none" stroke="#393CA0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* Heading */}
      <h2 className="text-[24px] font-bold text-center text-[#393CA0] mb-2">Great job, you've submitted<br />your project brief!</h2>
      {/* Subheading */}
      <p className="text-center text-gray-500 mb-6 max-w-xl">
        Our AI is now working on generating design challenges tailored to your needs based on the information you provided.
      </p>
      {/* Info Box */}
      <div className="bg-white border border-gray-200 rounded-[6px] px-5 py-4 mb-6 max-w-xl w-full flex items-start gap-3">
        <svg width="22" height="22" viewBox="0 0 22 22" className="mt-1 flex-shrink-0"><circle cx="11" cy="11" r="10" fill="#F4F4FB" /><text x="11" y="16" textAnchor="middle" fontSize="16" fill="#393CA0" fontFamily="Arial" fontWeight="bold">i</text></svg>
        <div>
          <div className="font-semibold text-[#393CA0] mb-1">What is a design challenge?</div>
          <div className="text-gray-600 text-[15px]">A design challenge is a statement, usually starting with the phrase, "How might we..." outlines the problem you want to solve, guiding your team throughout the innovation process.</div>
        </div>
      </div>
      {/* Next Button */}
      <button className="bg-[#393CA0] hover:bg-[#2C2E7A] text-white font-bold py-3 px-10 rounded-[6px] text-[17px] font-sans transition-colors">Next</button>
    </div>
  );
}
