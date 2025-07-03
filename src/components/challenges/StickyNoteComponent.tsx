
import { useState, useRef, useEffect } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StickyNote } from '@/types/designChallenge';
import { supabase } from '@/integrations/supabase/client';

interface StickyNoteComponentProps {
  note: StickyNote;
  onPositionChange: (noteId: string, x: number, y: number) => void;
  onDelete: (noteId: string) => void;
  canDelete: boolean;
  creatorName: string;
  creatorInitials: string;
}

export function StickyNoteComponent({
  note,
  onPositionChange,
  onDelete,
  canDelete,
  creatorName,
  creatorInitials,
}: StickyNoteComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: note.position_x, y: note.position_y });
  const [isOwner, setIsOwner] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsOwner(user?.id === note.created_by);
    };
    checkOwnership();
  }, [note.created_by]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement) return;
    
    setIsDragging(true);
    const rect = noteRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !noteRef.current) return;

    const parent = noteRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const newX = e.clientX - parentRect.left - dragOffset.x;
    const newY = e.clientY - parentRect.top - dragOffset.y;

    const clampedX = Math.max(0, Math.min(newX, parentRect.width - 200));
    const clampedY = Math.max(0, Math.min(newY, parentRect.height - 150));

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onPositionChange(note.id, position.x, position.y);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, position]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this idea?')) {
      onDelete(note.id);
    }
  };

  const canDeleteNote = isOwner || canDelete;

  return (
    <div
      ref={noteRef}
      className="absolute cursor-move select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'rotate(2deg)' : 'rotate(0deg)',
        zIndex: isDragging ? 1000 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="w-48 min-h-32 p-3 rounded-lg shadow-lg border-2 border-gray-200 transition-transform hover:scale-105"
        style={{ backgroundColor: note.color }}
      >
        <div className="flex items-start justify-between mb-2">
          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {canDeleteNote && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto hover:bg-red-100"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap break-words">
          {note.content}
        </p>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Avatar className="w-4 h-4">
            <AvatarImage src={note.profiles?.avatar_url || undefined} />
            <AvatarFallback className="text-xs">{creatorInitials}</AvatarFallback>
          </Avatar>
          <span>{creatorName}</span>
        </div>
      </div>
    </div>
  );
}
