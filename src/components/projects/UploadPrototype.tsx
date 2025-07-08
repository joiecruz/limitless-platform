import React, { useRef } from "react";

export interface UploadedPrototype {
  id: string;
  name: string;
  image: string;
}

interface UploadPrototypeProps {
  uploadedPrototypes: UploadedPrototype[];
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export default function UploadPrototype({ uploadedPrototypes, onUpload, isUploading }: UploadPrototypeProps) {
  const [expanded, setExpanded] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  const content = (
    <div className="w-full min-h-full p-8 bg-[#F4F4FB] relative">
      {/* Expand button */}
      <button
        className="absolute top-4 right-4 bg-white rounded-[10px] border border-[#E5E7EB] w-9 h-9 flex items-center justify-center hover:bg-[#F4F4F4] transition"
        title="Expand"
        onClick={() => setExpanded(true)}
        style={{ display: expanded ? 'none' : undefined }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 3H3v4M3 3l5 5M13 17h4v-4M17 17l-5-5" stroke="#393CA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <h1 className="text-4xl font-bold text-[#23262F] mb-2">Upload your prototype</h1>
      <div className="border-b-2 border-[#E5E7EB] mt-5 mb-2"></div>
      <p className="text-[#565D6D] text-[15px] mb-2 mt-4 max-w-4xl">
        Share your prototype to move forward in the testing process. Once your prototype is ready—whether it's a sketch, mockup, or interactive demo—upload it here as a screenshot or image. This step allows you to showcase your concept for feedback, refinement, and iteration.
      </p>
      <p className="text-[#565D6D] text-[15px] mb-6 max-w-4xl">
        Your prototype is a key step toward turning ideas into tangible solutions. Make sure it reflects your chosen "How Might We" question and the insights gathered. After uploading, you'll proceed to gather user feedback and refine your design.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {/* Add prototype card */}
        <div
          className="flex flex-col items-center justify-center border-2 border-[#393CA0] rounded-lg h-[210px] cursor-pointer transition hover:bg-[#F4F4FB] relative"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-2xl text-[#393CA0] mb-2">+</span>
          <span className="text-[#393CA0] text-lg font-normal">Add prototype</span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && <span className="absolute bottom-2 text-xs text-[#393CA0]">Uploading...</span>}
        </div>
        {/* Existing prototypes */}
        {uploadedPrototypes.map((p) => (
          <div key={p.id} className="flex flex-col">
            <img
              src={p.image}
              alt={p.name}
              className="rounded-lg object-cover w-full h-[210px] mb-2"
            />
            <span className="text-[#23262F] text-[15px] font-normal">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {content}
      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={() => setExpanded(false)}>
          <div
            className="bg-[#F4F4FB] rounded-xl shadow-lg relative overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-[#C7C9D9]"
            style={{ width: '80vw', maxWidth: '1200px', minHeight: '60vh', maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-white rounded-[10px] border border-[#E5E7EB] w-9 h-9 flex items-center justify-center hover:bg-[#F4F4F4] transition z-10"
              title="Close"
              onClick={() => setExpanded(false)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke="#393CA0" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <div className="p-8 w-full">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}
