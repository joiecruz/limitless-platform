import React, { useState } from "react";

const challenges = [
  "How might we improve our customer onboarding process to ensure new users feel confident and supported from day one?",
  "How might we reduce our product's environmental impact while maintaining its quality and affordability?",
  "How might we create a more engaging virtual workspace that fosters collaboration and creativity among remote team members?",
];

export default function ProjectDesignChallenges() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <h2 className="text-[28px] text-gray-800 font-bold text-center mb-6">Design Challenges</h2>
      <p className="text-center text-gray-600 mb-9 max-w-xl">
        Based on your project brief, we recommend the following options for your overarching design challenge.<br /><br />
        Select the one that best fits your needs, and feel free to make any modifications. Once you're ready, submit to continue.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xl mb-6 items-center">
        {challenges.map((challenge, idx) => (
          <button
            key={idx}
            type="button"
            className={`text-left px-4 py-3 rounded-[8px] border transition-all duration-150 text-[16px] text-gray-800 font-normal focus:outline-none w-[750px] ${
              selected === idx
                ? "border-[#393CA0] bg-[#F4F4FB] shadow-sm"
                : "border-gray-200 bg-white hover:border-[#393CA0]"
            }`}
            onClick={() => setSelected(idx)}
          >
            {challenge}
          </button>
        ))}
      </div>
      <button className="bg-[#393CA0] hover:bg-[#2C2E7A] text-white font-medium py-3 px-10 rounded-[6px] text-[17px] w-[180px] h-[48px] font-sans transition-colors">Submit</button>
    </div>
  );
}
