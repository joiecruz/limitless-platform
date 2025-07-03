import React, { useState, forwardRef, useImperativeHandle } from "react";

const SDG_LIST = [
  "No Poverty",
  "Zero Hunger",
  "Good Health and Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water and Sanitation",
  "Affordable and Clean Energy",
  "Decent Work and Economic Growth",
  "Industry, Innovation and Infrastructure",
  "Reduced Inequalities",
  "Sustainable Cities and Communities",
  "Responsible Consumption and Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace, Justice and Strong Institutions",
  "Partnerships for the Goals"
];

const TYPE_ICONS: Record<string, JSX.Element> = {
  "None": <img src="/projects-navbar-icons/prohibition.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Business model": <img src="/projects-navbar-icons/money-coins.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Network": <img src="/projects-navbar-icons/network.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Structure": <img src="/projects-navbar-icons/struct.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Process": <img src="/projects-navbar-icons/process.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Product": <img src="/projects-navbar-icons/product.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Product Ecosystem": <img src="/projects-navbar-icons/cubes.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Service": <img src="/projects-navbar-icons/settings.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Channel": <img src="/projects-navbar-icons/channel.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Brand": <img src="/projects-navbar-icons/brand.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Customer Engagement": <img src="/projects-navbar-icons/chat.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Campaign": <img src="/projects-navbar-icons/megaphone.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
  "Program": <img src="/projects-navbar-icons/list.svg" alt="Brand" width={18} height={18} style={{ marginRight: 8 }} />,
};

export interface ProjectSuccessCriteriaRef {
  validate: () => boolean | string;
}

const ProjectSuccessCriteria = forwardRef<ProjectSuccessCriteriaRef>((props, ref) => {
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [targetOutcomes, setTargetOutcomes] = useState("");
  const [touched, setTouched] = useState(false);

  useImperativeHandle(ref, () => ({
    validate: () => {
      setTouched(true);
      if (targetOutcomes.trim() === "") return "Target outcome is required.";
      if (selectedSDGs.length === 0) return "At least one SDG is required.";
      if (selectedTypes.length === 0) return "At least one innovation type is required.";
      return true;
    }
  }));

  const showSDGError = touched && selectedSDGs.length === 0;
  const showTypeError = touched && selectedTypes.length === 0;
  const showOutcomeError = touched && targetOutcomes.trim() === "";

  function handleSDGChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value && !selectedSDGs.includes(value) && selectedSDGs.length < 3) {
      setSelectedSDGs([...selectedSDGs, value]);
    }
    e.target.value = "";
  }

  function removeSDG(sdg: string) {
    setSelectedSDGs(selectedSDGs.filter((s) => s !== sdg));
  }

  return (
    <div className="mt-1.5 bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-start" style={{ width: '55vw', minHeight: '52vh' }}>
      <div className="flex items-center mb-3">
        <img src="/projects-navbar-icons/check-circle.svg" alt="Info" width={22} height={14} style={{ marginRight: 13, color: '#2FD5C8', filter: 'invert(62%) sepia(99%) saturate(377%) hue-rotate(127deg) brightness(97%) contrast(92%)' }} />
        <span className="text-[17px] font-bold font-sans" style={{ color: '#1E2128FF' }}>Success Criteria</span>
      </div>
      <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="project-target-outcomes">Target Outcomes</label>
      <textarea
        id="project-target-outcomes"
        placeholder="Describe the impact and outcomes that you hope to achieve through this innovation project."
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[80px] font-sans placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] ${showOutcomeError ? 'border-red-400' : 'border-gray-200'}`}
        style={{  marginBottom: 10}}
        value={targetOutcomes}
        onChange={e => setTargetOutcomes(e.target.value)}
      />

      <label className="block text-[13px] text-gray-600 font-bold font-sans mb-0" htmlFor="project-sdgs">SDGs (Sustainable Development Goals) Targeted</label>
      <div className="w-full mb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedSDGs.map((sdg) => (
            <span key={sdg} className="bg-[#2FD5C8] text-white px-2 py-1 rounded-full text-[11px] font-medium flex items-center mt-1">
              {sdg}
              <button type="button" className="ml-2 text-white hover:text-gray-200" onClick={() => removeSDG(sdg)}>&times;</button>
            </span>
          ))}
        </div>
        <select
          id="project-sdgs"
          className={`mb-[-5px] w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] font-sans text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white ${showSDGError ? 'border-red-400' : 'border-gray-200'}`}
          onChange={handleSDGChange}
          disabled={selectedSDGs.length >= 3}
          value=""
        >
          <option value="" disabled>Select up to 3 the Sustainable Development Goals (SDGs) that this project aligns with.</option>
          {SDG_LIST.map((sdg) => (
            <option key={sdg} value={sdg} disabled={selectedSDGs.includes(sdg)}>{sdg}</option>
          ))}
        </select>
      </div>

      <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="project-type-inno">Do you already have a type of innovation in mind? (Select up to 3)</label>
      <div className="flex flex-wrap gap-x-3 gap-y-0 mb-0 w-full">
        {[
          "None",
          "Business model",
          "Network",
          "Structure",
          "Process",
          "Product",
          "Product Ecosystem",
          "Service",
          "Channel",
          "Brand",
          "Customer Engagement",
          "Campaign",
          "Program"
        ].map((type) => {
          const selected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                if (selected) {
                  setSelectedTypes(selectedTypes.filter((t) => t !== type));
                } else if (selectedTypes.length < 3) {
                  setSelectedTypes([...selectedTypes, type]);
                }
              }}
              className={`rounded-[10px] border font-medium h-[50px] px-4 py-3 text-[13px] font-sans transition-colors focus:outline-none flex items-center bg-white text-gray-700
                ${selectedTypes.length >= 3 && !selected ? 'opacity-50 cursor-not-allowed' : ''}
                ${selected ? 'bg-[#DADBF2]/40 border-[#393CA0FF]' : showTypeError ? 'border-red-400' : 'border-gray-200'}
              `}
              style={{ minWidth: 120, marginBottom: 8 }}
              disabled={selectedTypes.length >= 3 && !selected}
            >
              {React.cloneElement(TYPE_ICONS[type], {
                width: 20,
                height: 20,
                style: { marginRight: 8, filter: selected ? 'invert(22%) sepia(13%) saturate(3552%) hue-rotate(210deg) brightness(92%) contrast(101%)' : undefined }
              })}
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default ProjectSuccessCriteria; 