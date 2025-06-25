import React, { useState } from "react";
import ProjectLoading from "./ProjectLoading";

const challenges = [
  "How might we improve our customer onboarding process to ensure new users feel confident and supported from day one?",
  "How might we reduce our product's environmental impact while maintaining its quality and affordability?",
  "How might we create a more engaging virtual workspace that fosters collaboration and creativity among remote team members?",
];

export default function ProjectDesignChallenges() {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <ProjectLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full ml-[-18px]">
      <h2 className="mt-11 text-[26px] text-gray-800 font-bold text-center mb-7">Design Challenges</h2>
      <p className="text-center text-gray-600 mb-10 max-w-xl text-[15px]">
        Based on your project brief, we recommend the following options for your overarching design challenge.<br /><br />
        Select the one that best fits your needs, and feel free to make any modifications. Once you're ready, submit to continue.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xl mb-6 items-center text-[15px]">
        {challenges.map((challenge, idx) => (
          <button
            key={idx}
            type="button"
            className={`text-left px-4 py-3 rounded-[8px] border transition-all duration-150 text-[15px] text-gray-800 font-normal focus:outline-none w-[750px] ${
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
      <button
        className="relative btn-shine mt-[8px] bg-[#393CA0] hover:bg-[#2C2E7A] text-white font-semibold py-2 rounded-[6px] text-[15px] w-[150px] h-[40px] font-sans transition-colors flex items-center justify-center gap-1"
        onClick={() => setLoading(true)}
      >
        Submit
      </button>
    </div>
  );
}
