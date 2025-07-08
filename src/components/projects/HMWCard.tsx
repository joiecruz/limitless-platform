import React from 'react';

type HMWCardProps = {
  text: string;
  stars: number;
  avatar: string;
  selected?: boolean;
  onSelect?: () => void;
};

export default function HMWCard({ text, stars, avatar, selected = false, onSelect }: HMWCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[3px] p-4 flex flex-col justify-between min-h-[120px] shadow-sm">
      <div className="text-[14px] font-normal text-[#23262F] mb-7 leading-snug">{text}</div>
      <div className="flex items-center justify-between mt-auto">
        <button
          className={`flex items-center gap-1 px-2 pt-1 pb-2 border border-[#E5E7EB] rounded-[3px] text-[15px] font-medium transition ${selected ? 'bg-[#393CA0] text-white' : 'bg-white text-[#23262F] hover:bg-[#F4F4F4]'}`}
          onClick={onSelect}
        >
          <span className="text-[19px] leading-none">{selected ? '★' : '☆'}</span>
        </button>
        <img src={avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB] ml-2" />
      </div>
    </div>
  );
}
