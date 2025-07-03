
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreateStickyNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNote: (content: string, color: string) => Promise<void>;
}

const colors = [
  { name: 'Yellow', value: '#FEF3C7' },
  { name: 'Pink', value: '#FCE7F3' },
  { name: 'Blue', value: '#DBEAFE' },
  { name: 'Green', value: '#D1FAE5' },
  { name: 'Purple', value: '#E9D5FF' },
  { name: 'Orange', value: '#FED7AA' },
];

export function CreateStickyNoteDialog({
  open,
  onOpenChange,
  onCreateNote,
}: CreateStickyNoteDialogProps) {
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateNote(content.trim(), selectedColor);
      setContent('');
      setSelectedColor(colors[0].value);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Idea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Your Idea *</Label>
            <Textarea
              id="content"
              placeholder="Share your idea..."
              className="min-h-[100px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color.value
                      ? 'border-gray-800 ring-2 ring-gray-300'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? 'Adding...' : 'Add Idea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
