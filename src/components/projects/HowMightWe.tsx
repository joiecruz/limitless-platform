import React from 'react';
import HMWCard from './HMWCard';

const questions = [
  {
    id: 1,
    text: 'How might we create more farms in the Philippines?',
    stars: 3,
    avatar: '/sample-avatars/john.jpg',
  },
  {
    id: 2,
    text: 'How might we create more farms in the Philippines?',
    stars: 3,
    avatar: '/sample-avatars/john.jpg',
  },
  {
    id: 3,
    text: 'How might we create more farms in the Philippines?',
    stars: 3,
    avatar: '/sample-avatars/john.jpg',
  },
  {
    id: 4,
    text: 'How might we create more farms in the Philippines?',
    stars: 3,
    avatar: '/sample-avatars/john.jpg',
  },
  {
    id: 5,
    text: 'How might we create more farms in the Philippines?',
    stars: 3,
    avatar: '/sample-avatars/john.jpg',
  },
  {
    id: 6,
    text: 'How might we create more farms in the Philippines?',
    stars: 3,
    avatar: '/sample-avatars/john.jpg',
  },
];

export default function HowMightWe() {
  return (
    <div className="bg-[#F4F4FB] h-full w-full p-8">
      <h1 className="text-[2rem] font-bold leading-tight text-[#23262F] mb-0">How Might We Questions</h1>
      <div className="border-b-2 border-[#E5E7EB] mt-5 mb-2"></div>
      <div className="flex flex-row items-end justify-between px-0 pt-2 pb-3">
        <div className="flex-1 basis-[70%] max-w-[70%]">
          <p className="text-[#565D6D] text-[12px] mt-1 mb-0 max-w-xl font-normal">
            A "How Might We" question is a simple way to turn a problem into an opportunity for creative solutions. Create new HMW questions based on your insights gathered.
          </p>
        </div>
        <div className="flex justify-end flex-1 basis-[40%] max-w-[40%]">
          <button className="flex items-center gap-2 bg-[#393CA0] hover:bg-[#232262] text-white font-normal px-2 y-2 rounded-[3px] text-[13px] shadow-none h-[42px]">
            <span className="text-lg font-normal">+</span> Add HMW Question
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-7">
        {questions.map(q => (
          <HMWCard key={q.id} text={q.text} stars={q.stars} avatar={q.avatar} />
        ))}
      </div>
    </div>
  );
}
