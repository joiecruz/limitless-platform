import React, { useState } from 'react';
import HMWCard from './HMWCard';

export interface HMWQuestion {
  id: number;
  text: string;
  stars: number;
  avatar: string;
}

interface HowMightWeProps {
  questions?: HMWQuestion[];
  onQuestionsChange?: (questions: HMWQuestion[]) => void;
  selectedIds?: number[];
  onQuestionsSelect?: (selected: HMWQuestion[]) => void;
  onAdd?: (question: HMWQuestion) => void;
}

const defaultQuestions: HMWQuestion[] = [
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

export default function HowMightWe({ questions, onQuestionsChange, selectedIds: selectedIdsProp, onQuestionsSelect, onAdd }: HowMightWeProps) {
  const [expanded, setExpanded] = useState(false);
  // Use controlled questions if provided, otherwise fallback to local state
  const [internalQuestions, setInternalQuestions] = useState<HMWQuestion[]>(defaultQuestions);
  const displayQuestions = questions || internalQuestions;
  // Selection state (controlled or uncontrolled)
  const [internalSelectedIds, setInternalSelectedIds] = useState<number[]>([]);
  const selectedIds = selectedIdsProp || internalSelectedIds;
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  // Example: Add question handler (not used yet)
  const handleAddQuestion = (q: HMWQuestion) => {
    if (questions && onQuestionsChange) {
      onQuestionsChange([...questions, q]);
    } else {
      setInternalQuestions(prev => [...prev, q]);
    }
    if (onAdd) onAdd(q);
  };

  // Handle card select
  const handleCardSelect = (id: number) => {
    let newSelected: number[];
    if (selectedIds.includes(id)) {
      newSelected = selectedIds.filter(sid => sid !== id);
    } else {
      newSelected = [...selectedIds, id];
    }
    if (selectedIdsProp && onQuestionsSelect) {
      // Controlled
      onQuestionsSelect(displayQuestions.filter(q => newSelected.includes(q.id)));
    } else {
      setInternalSelectedIds(newSelected);
      if (onQuestionsSelect) {
        onQuestionsSelect(displayQuestions.filter(q => newSelected.includes(q.id)));
      }
    }
  };

  // Modal submit handler
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const nextId = displayQuestions.length > 0 ? Math.max(...displayQuestions.map(q => q.id)) + 1 : 1;
    const q: HMWQuestion = {
      id: nextId,
      text: newQuestion.trim(),
      stars: 3,
      avatar: '/sample-avatars/john.jpg',
    };
    // Add to array and update parent immediately
    const updated = [...displayQuestions, q];
    if (onQuestionsChange) onQuestionsChange(updated);
    if (onAdd) onAdd(q);
    setNewQuestion('');
    setShowModal(false);
  };

  const content = (
    <div className="bg-[#F4F4FB] h-full w-full p-8 relative">
      {/* Expand button */}
      <button
        className="absolute top-4 right-4 bg-white rounded-[10px] border border-[#E5E7EB] w-9 h-9 flex items-center justify-center hover:bg-[#F4F4F4] transition"
        title="Expand"
        onClick={() => setExpanded(true)}
        style={{ display: expanded ? 'none' : undefined }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 3H3v4M3 3l5 5M13 17h4v-4M17 17l-5-5" stroke="#393CA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <h1 className="text-[2rem] font-bold leading-tight text-[#23262F] mb-0">How Might We Questions</h1>
      <div className="border-b-2 border-[#E5E7EB] mt-5 mb-2"></div>
      <div className="flex flex-row items-end justify-between px-0 pt-2 pb-3">
        <div className="flex-1 basis-[70%] max-w-[70%]">
          <p className="text-[#565D6D] text-[14px] mt-1 mb-0 max-w-4xl font-normal">
            A "How Might We" question is a simple way to turn a problem into an opportunity for creative solutions. Create new HMW questions based on your insights gathered.
          </p>
        </div>
        <div className="flex justify-end flex-1 basis-[40%] max-w-[40%]">
          <button
            className="flex items-center gap-2 bg-[#393CA0] hover:bg-[#232262] text-white font-normal px-2 y-2 rounded-[3px] text-[13px] shadow-none h-[42px]"
            onClick={() => setShowModal(true)}
          >
            <span className="text-lg font-normal">+</span> Add HMW Question
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-7">
        {displayQuestions.map(q => (
          <HMWCard
            key={q.id}
            text={q.text}
            stars={q.stars}
            avatar={q.avatar}
            selected={selectedIds.includes(q.id)}
            onSelect={() => handleCardSelect(q.id)}
          />
        ))}
      </div>
      {/* Modal for adding HMW question */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-[#393CA0] text-xl font-bold"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Add HMW Question</h2>
            <form onSubmit={handleModalSubmit}>
              <input
                type="text"
                className="w-full border border-[#E5E7EB] rounded px-3 py-2 mb-4"
                placeholder="Enter your How Might We question..."
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#393CA0] text-white px-4 py-2 rounded hover:bg-[#232262]"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {content}
      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={() => setExpanded(false)}>
          <div
            className="bg-[#F4F4FB] rounded-xl shadow-lg relative overflow-y-auto overflow-x-hidden"
            style={{ width: '80vw', maxWidth: '1200px', minHeight: '80vh', maxHeight: '85vh' }}
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
