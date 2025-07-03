import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { StickyNote } from '@/types/designChallenge';

interface StickyNoteComponentProps {
  note: StickyNote;
  onPositionChange: (x: number, y: number) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export const StickyNoteComponent = ({ note, onPositionChange, onDelete, canDelete }: StickyNoteComponentProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: note.position_x, y: note.position_y });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Constrain to bounds
    const constrainedX = Math.max(0, Math.min(newX, 2000 - 200));
    const constrainedY = Math.max(0, Math.min(newY, 1500 - 150));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onPositionChange(position.x, position.y);
    }
  };

  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

  const getInitials = (firstName: string | null, lastName: string | null, email: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return email[0].toUpperCase();
  };

  return (
    <Card
      ref={dragRef}
      className={`absolute w-48 h-36 cursor-move transition-transform select-none ${
        isDragging ? 'scale-105 shadow-lg z-50' : 'hover:scale-102 z-10'
      }`}
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: note.color,
        borderColor: note.color,
      }}
      onMouseDown={handleMouseDown}
    >
      <CardContent className="p-3 h-full flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={note.creator?.avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {getInitials(
                  note.creator?.first_name,
                  note.creator?.last_name,
                  note.creator?.email || ''
                )}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600 truncate">
              {note.creator?.first_name && note.creator?.last_name
                ? `${note.creator.first_name} ${note.creator.last_name}`
                : note.creator?.email}
            </span>
          </div>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-auto p-1 text-gray-500 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-800 leading-tight line-clamp-4">
            {note.content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};