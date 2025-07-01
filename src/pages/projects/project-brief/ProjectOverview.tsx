import React, { useImperativeHandle, useRef, useState, forwardRef } from "react";

export interface ProjectOverviewRef {
  validate: () => boolean | string;
  getValues: () => {
    name: string;
    description: string;
    problem: string;
    customers: string;
  };
}

const ProjectOverview = forwardRef<ProjectOverviewRef>((props, ref) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [customers, setCustomers] = useState("");
  const [touched, setTouched] = useState(false);

  useImperativeHandle(ref, () => ({
    validate: () => {
      setTouched(true);
      if (
        name.trim() === "" ||
        description.trim() === "" ||
        problem.trim() === "" ||
        customers.trim() === ""
      ) return "All fields must be filled out.";
      return true;
    },
    getValues: () => ({ name, description, problem, customers })
  }));

  return (
    <div className="mt-1.5 bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-start" style={{ width: '55vw', minHeight: '52vh' }}>
      <div className="flex items-center mb-3">
        <img src="/projects-navbar-icons/info-circle.svg" alt="Info" width={22} height={14} style={{ marginRight: 13, color: '#2FD5C8', filter: 'invert(62%) sepia(99%) saturate(377%) hue-rotate(127deg) brightness(97%) contrast(92%)' }} />
        <span className="text-[17px] font-bold font-sans" style={{ color: '#1E2128FF' }}>Overview</span>
      </div>
      <label className="block text-[13px] text-gray-600 font-bold font-sans mb-0" htmlFor="project-name">Project Name</label>
      <input
        id="project-name"
        type="text"
        placeholder="What is the name of your project?"
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[40px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] ${touched && name.trim() === "" ? 'border-red-400' : 'border-gray-200'}`}
        style={{ marginBottom: 10 }}
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <label className="block text-[13px] text-gray-600 font-bold font-sans mb-0" htmlFor="project-description">Project Description</label>
      <textarea
        id="project-description"
        placeholder="Provide a summary of your project goals and objectives."
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[80px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] resize-none ${touched && description.trim() === "" ? 'border-red-400' : 'border-gray-200'}`}
        style={{ marginBottom: 10 }}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <label className="block text-[13px] text-gray-600 font-bold font-sans mb-0" htmlFor="project-problem">Problem or Opportunity</label>
      <textarea
        id="project-problem"
        placeholder="Describe the problem the project aims to solve or the opportunity it seeks to leverage."
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[80px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] resize-none ${touched && problem.trim() === "" ? 'border-red-400' : 'border-gray-200'}`}
        style={{ marginBottom: 10 }}
        value={problem}
        onChange={e => setProblem(e.target.value)}
      />

      <label className="block text-[13px] text-gray-600 font-bold font-sans mb-0" htmlFor="project-customers">Target customers or audience</label>
      <input
        id="project-customers"
        type="text"
        placeholder="Identify the primary audience or beneficiaries of the project"
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[40px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] ${touched && customers.trim() === "" ? 'border-red-400' : 'border-gray-200'}`}
        style={{ marginBottom: 10 }}
        value={customers}
        onChange={e => setCustomers(e.target.value)}
      />
    </div>
  );
});

export default ProjectOverview; 