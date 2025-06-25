import React from "react";

export default function SearchHeader() {
  return (
    <header className="w-full bg-white px-6 py-4 flex items-center border-b border-gray-300">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#F6F7F9] rounded-[6px] pl-10 pr-4 py-2 text-[15px] placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
