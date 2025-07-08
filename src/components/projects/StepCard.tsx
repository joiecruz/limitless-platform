import React, { useRef, useState } from "react";

interface StepCardProps {
  title: string;
  description: string;
  options?: string[];
  duration?: string | null;
  action: { label: string; active: boolean };
  checked: boolean;
  active?: boolean;
  disabled?: boolean;
  onCheck?: () => void;
  canCheck?: boolean;
  optionChecked?: boolean[];
  onOptionCheck?: (idx: number) => void;
  actions?: { label: string; icon: React.ReactNode }[];
  actionSelected?: boolean[];
  onActionSelect?: (idx: number) => void;
  dropdownOptions?: string[];
  dropdownSelected?: string[];
  onDropdownSelect?: (selected: string[]) => void;
  onAction?: () => void;
  isGenerating?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
  title,
  description,
  options,
  duration,
  action,
  checked,
  active,
  disabled,
  onCheck,
  canCheck,
  optionChecked,
  onOptionCheck,
  actions,
  actionSelected,
  onActionSelect,
  dropdownOptions,
  dropdownSelected,
  onDropdownSelect,
  onAction,
  isGenerating,
}) => {
  // Use colored right side and button for active or checked cards
  const isActiveOrChecked = active || checked;
  const cardBorder = active ? 'border-[#393CA0]' : 'border-[#E5E7EB]';
  const cardBg = 'bg-white';
  const rightBg = isActiveOrChecked ? 'bg-[#E6E8FA]' : 'bg-[#E5E7EB]';
  const buttonBg = isActiveOrChecked ? 'bg-[#393CA0] text-white hover:bg-[#232262]' : 'bg-[#C7C9D9] text-[#fff]';
  const titleColor = 'text-[#23262F]';

  // Dropdown state for open/close
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div
      className={`flex rounded ${cardBorder} ${cardBg} shadow-sm px-0 py-0 ${disabled ? 'opacity-60' : ''}`}
      style={{ minHeight: 72 }}
    >
      {/* Left: Checkbox + Content */}
      <div className="flex flex-row items-start basis-[70%] w-4/5 px-4 py-3">
        {/* Checkbox */}
        <div className="flex items-start pt-[2px] pr-2">
          <input
            type="checkbox"
            className="accent-[#393CA0] w-4 h-4 mt-[2px]"
            checked={checked}
            disabled={!canCheck}
            onChange={onCheck}
          />
        </div>
        {/* Text content */}
        <div className="flex flex-col">
          <span className={`font-bold text-[15px] ${titleColor}`}>{title}</span>
          <div className="text-[#565D6D] text-[11px] mb-2 mt-1 leading-snug">{description}</div>
          {/* Dropdown multi-select */}
          {dropdownOptions && dropdownOptions.length > 0 && (
            <div className="relative w-full max-w-xs" ref={dropdownRef}>
              <button
                type="button"
                className={`w-full border border-[#393CA0] rounded px-2 py-1 text-[13px] font-normal flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-[#393CA0] ${dropdownOpen ? 'ring-2 ring-[#393CA0]' : ''}`}
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <span className={`truncate ${!dropdownSelected || dropdownSelected.length === 0 ? 'text-[#9095A1]' : 'text-[#23262F]'}`}>
                  {dropdownSelected && dropdownSelected.length > 0
                    ? dropdownSelected.slice(0, 3).join(', ') + (dropdownSelected.length > 3 ? ` +${dropdownSelected.length - 3}` : '')
                    : 'Choose testing methods (up to 3)'}
                </span>
                <svg width="18" height="18" fill="none" viewBox="0 0 20 20" className="ml-2"><path d="M6 8l4 4 4-4" stroke="#393CA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-[#393CA0] rounded shadow-lg max-h-48 overflow-auto">
                  {dropdownOptions.map(opt => (
                    <label key={opt} className="flex items-center px-3 py-2 cursor-pointer hover:bg-[#F4F4F4] text-[13px]">
                      <input
                        type="checkbox"
                        className="accent-[#393CA0] mr-2"
                        checked={dropdownSelected?.includes(opt) || false}
                        disabled={dropdownSelected && !dropdownSelected.includes(opt) && dropdownSelected.length >= 3}
                        onChange={() => {
                          if (!dropdownSelected) return;
                          let next;
                          if (dropdownSelected.includes(opt)) {
                            next = dropdownSelected.filter(o => o !== opt);
                          } else if (dropdownSelected.length < 3) {
                            next = [...dropdownSelected, opt];
                          } else {
                            next = dropdownSelected;
                          }
                          if (onDropdownSelect) onDropdownSelect(next);
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Render actions if provided */}
          {actions && actions.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2 mb-2 mt-1 max-w-full w-full">
              {actions.map((a, i) => {
                const selected = actionSelected ? actionSelected[i] : false;
                return (
                  <button
                    key={a.label}
                    className={`flex items-center gap-1 border border-[#393CA0] rounded px-2 py-1 text-[12px] font-medium transition whitespace-nowrap ${selected ? 'bg-[#E6E8FA] text-[#393CA0]' : 'bg-white text-[#393CA0] hover:bg-[#F4F4F4]'}`}
                    type="button"
                    style={{ maxWidth: '100%' }}
                    onClick={onActionSelect ? () => onActionSelect(i) : undefined}
                    disabled={onActionSelect && !selected && actionSelected && actionSelected.filter(Boolean).length >= 3}
                  >
                    <span className="w-4 h-4 flex items-center justify-center">{a.icon}</span>
                    {a.label}
                  </button>
                );
              })}
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-2 bg-[#EFFCFB] text-[#27AE60] text-[11px] px-2 py-[2px] mt-1 rounded-[5px] w-fit mb-1">
              <svg width="11" height="11" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#27AE60" strokeWidth="1.5"/><path stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" d="M8 4v4l2 2"/></svg>
              {duration}
            </div>
          )}
          {options && (
            <div className="flex gap-4 mb-1 mt-1">
              {options.map((opt, i) => (
                <label key={opt} className="flex items-center gap-1 text-[#23262F] text-[13px] font-normal">
                  <input
                    type="checkbox"
                    className="accent-[#393CA0] w-4 h-4"
                    checked={optionChecked ? optionChecked[i] : false}
                    onChange={onOptionCheck ? () => onOptionCheck(i) : undefined}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Right: Action button on colored background */}
      <div className={`flex items-center justify-center ${rightBg} rounded-r px-6 basis-[30%] w-1/5 min-w-[120px]`}>
        <button
          className={`flex items-center gap-2 px-2 py-2 rounded text-[13px] transition-colors ${buttonBg}`}
          disabled={!action.active || isGenerating}
          onClick={onAction}
        >
          {/* Icon (magic wand) */}
          <svg width="16" height="16" fill="none" viewBox="0 0 18 18"><path d="M7.5 2.25v1.5M2.25 7.5h1.5M4.5 4.5l-1.06-1.06M13.5 4.5l1.06-1.06M15.75 7.5h-1.5M10.5 2.25v1.5M13.5 13.5l1.06 1.06M7.5 15.75v-1.5M2.25 10.5h1.5M4.5 13.5l-1.06 1.06M10.5 15.75v-1.5M15.75 10.5h-1.5M13.5 13.5l1.06 1.06M10.5 10.5l-6-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {isGenerating ? 'Generating...' : action.label}
        </button>
      </div>
    </div>
  );
};

export default StepCard;
