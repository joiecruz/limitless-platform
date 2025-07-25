import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WandSparkles } from 'lucide-react';
import { StickyNote } from './StickyNoteCard';

interface CreateNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (note: Omit<StickyNote, 'id' | 'created_by' | 'is_favorite' | 'position'> & Partial<Pick<StickyNote, 'id' | 'created_by' | 'is_favorite' | 'position'>>) => void;
  initialNote?: Partial<StickyNote>;
  title?: string;
  namePlaceholder?: string;
  descriptionPlaceholder?: string;
  createLabel?: string;
}

const DEFAULT_COLOR = '#FEF3C7';

const COLOR_OPTIONS = [
  '#FEF3C7', // Yellow
  '#FEE2E2', // Red
  '#DBEAFE', // Blue
  '#D1FAE5', // Green
  '#F3E8FF', // Purple
  '#FED7AA', // Orange
  '#FCE7F3', // Pink
  '#E0E7FF', // Indigo
];

const CreateNoteDialog: React.FC<CreateNoteDialogProps> = ({
  open,
  onClose,
  onSave,
  initialNote,
  title = 'Create new idea',
  namePlaceholder = 'Enter item name',
  descriptionPlaceholder = 'Enter item description',
  createLabel = 'Create',
}) => {
  const [name, setName] = useState(initialNote?.title || '');
  const [description, setDescription] = useState(initialNote?.description || '');
  const [color, setColor] = useState(initialNote?.color || DEFAULT_COLOR);

  useEffect(() => {
    setName(initialNote?.title || '');
    setDescription(initialNote?.description || '');
    setColor(initialNote?.color || DEFAULT_COLOR);
  }, [initialNote, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...initialNote,
      title: name.trim(),
      description: description.trim(),
      color,
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset form fields
    setName('');
    setDescription('');
    setColor(DEFAULT_COLOR);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold">{title}</span>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#393CA0] focus:border-[#393CA0] transition-colors"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
            placeholder={namePlaceholder}
            autoFocus
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#393CA0] focus:border-[#393CA0] min-h-[100px] resize-none transition-colors"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={400}
            placeholder={descriptionPlaceholder}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: colorOption }}
                onClick={() => setColor(colorOption)}
                title={`Select ${colorOption} color`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} type="button">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name.trim()} 
            type="button" 
            className="bg-[#393CA0] hover:bg-[#393CA0]/90 text-white"
          >
            {createLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog; 