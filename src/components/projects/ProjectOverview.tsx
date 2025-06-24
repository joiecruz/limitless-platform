import React from "react";

export default function ProjectOverview() {
  return (
    <div className="mt-1.5 bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-start" style={{ width: '60vw', height: '52vh' }}>
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
  );
} 