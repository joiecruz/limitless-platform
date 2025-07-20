import React, { useState, useRef } from 'react';
import { Star, StarOff, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StickyNote {
  id: string;
  title: string;
  description: string;
  color: string;
  is_favorite: boolean;
  position: { x: number; y: number };
  created_by?: string;
}

interface StickyNoteCardProps {
  note: StickyNote;
  onEdit: (note: StickyNote) => void;
  onDelete: (id: string) => void;
  onFavorite: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
}

export const StickyNoteCard: React.FC<StickyNoteCardProps> = ({ note, onEdit, onDelete, onFavorite, onMove }) => {
  // Debug: log note.position
  // console.log('StickyNoteCard render', note.id, 'note.position:', note.position);
  const safePosition = (note.position && typeof note.position.x === 'number' && typeof note.position.y === 'number')
    ? note.position
    : { x: 100, y: 100 };
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - safePosition.x,
      y: e.clientY - safePosition.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    if (isNaN(dragStart.x) || isNaN(dragStart.y)) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    if (isNaN(newX) || isNaN(newY)) return;
    onMove(note.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      ref={dragRef}
      className={cn(
        'absolute w-64 min-h-56 max-h-64 rounded-xl shadow-lg p-4 cursor-move select-none transition-transform flex flex-col',
        isDragging ? 'scale-105 shadow-xl z-50' : 'hover:scale-102 z-10',
        note.is_favorite ? 'ring-2 ring-yellow-400' : ''
      )}
      style={{
        left: safePosition.x,
        top: safePosition.y,
        background: note.color,
      }}
      onMouseDown={handleMouseDown}
      title={note.title}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg leading-tight flex-1 pr-2 break-words" title={note.title}>
          {note.title.length > 40 ? note.title.slice(0, 40) + '…' : note.title}
        </h3>
        <button
          onClick={e => { e.stopPropagation(); onFavorite(note.id); }}
          className="ml-2 text-yellow-500 hover:text-yellow-600 transition-colors flex-shrink-0"
          title={note.is_favorite ? 'Unfavorite' : 'Favorite'}
        >
          {note.is_favorite ? (
            <Star fill="#FACC15" stroke="#FACC15" className="w-5 h-5" />
          ) : (
            <StarOff className="w-5 h-5" />
          )}
        </button>
      </div>
      <div
        className="flex-1 overflow-auto mb-2"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
        }}
      >
        {note.description}
      </div>
      <div className="flex items-center justify-end gap-2 mt-auto pt-2">
        <button
          onClick={e => { e.stopPropagation(); onEdit(note); }}
          className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded hover:bg-white/20"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(note.id); }}
          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-white/20"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StickyNoteCard; 