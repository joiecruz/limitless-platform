import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { KeyMetric } from '@/hooks/useImplement';
import { Save, X, Trash2 } from 'lucide-react';

interface EditMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: KeyMetric | null;
  onUpdate: (updatedMetric: KeyMetric) => void;
  onAdd?: (newMetric: KeyMetric) => void;
  onDelete?: () => void;
  isNewMetric?: boolean;
}

export default function EditMetricModal({
  isOpen,
  onClose,
  metric,
  onUpdate,
  onAdd,
  onDelete,
  isNewMetric = false,
}: EditMetricModalProps) {
  const [formData, setFormData] = useState<KeyMetric>({
    indicator: '',
    target: 0,
    unit: '',
    due: '',
    lastUpdated: {
      value: 0,
      date: new Date().toISOString().split('T')[0],
    },
    progress: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form when modal opens or metric changes
  useEffect(() => {
    if (metric && !isNewMetric) {
      setFormData({
        ...metric,
        lastUpdated: {
          ...metric.lastUpdated,
          date: new Date().toISOString().split('T')[0],
        },
      });
    } else if (isNewMetric) {
      setFormData({
        indicator: '',
        target: 0,
        unit: '',
        due: '',
        lastUpdated: {
          value: 0,
          date: new Date().toISOString().split('T')[0],
        },
        progress: 0,
      });
    }
  }, [metric, isNewMetric]);

  const handleInputChange = (field: keyof KeyMetric, value: any) => {
    if (field === 'lastUpdated') {
      setFormData(prev => ({
        ...prev,
        lastUpdated: {
          ...prev.lastUpdated,
          value: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    const updatedMetric: KeyMetric = {
      ...formData,
      progress: metric ? metric.progress : 0,
    };
    if (isNewMetric && onAdd) {
      onAdd(updatedMetric);
    } else {
      onUpdate(updatedMetric);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  const isFormValid = () => {
    if (formData.indicator.trim() === '') return false;
    if (formData.target <= 0) return false;
    if (formData.unit.trim() === '') return false;
    if (formData.due.trim() === '') return false;
    if (formData.due < today) return false;
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-bold">
            {isNewMetric ? 'Add New Metric' : 'Edit Metric'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metric Definition Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Metric Definition</h3>

          {/* Indicator */}
          <div className="space-y-2">
            <Label htmlFor="indicator" className="text-sm font-medium">
              Key Performance Indicator *
            </Label>
            <Textarea
              id="indicator"
              value={formData.indicator}
              onChange={(e) => handleInputChange('indicator', e.target.value)}
              placeholder="e.g., User engagement rate, Revenue growth, Customer satisfaction score"
              className="min-h-[80px] resize-none"
              required
            />
          </div>

          {/* Target and Unit Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target" className="text-sm font-medium">
                Target Value *
              </Label>
              <Input
                id="target"
                type="number"
                value={formData.target}
                onChange={(e) => handleInputChange('target', Number(e.target.value))}
                placeholder="100"
                min={0}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium">
                Unit *
              </Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="%, users, $, etc."
                required
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due" className="text-sm font-medium">
              Due Date *
            </Label>
            <Input
              id="due"
              type="date"
              value={formData.due}
              onChange={(e) => handleInputChange('due', e.target.value)}
              required
            />
            </div>
          </div>

          {/* Action Buttons */}
          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
          {formData.due && formData.due < today && (
            <div className="text-red-600 text-xs">Due date cannot be in the past.</div>
          )}
          {formData.target <= 0 && (
            <div className="text-red-600 text-xs">Target must be greater than 0.</div>
          )}
          <div className="flex justify-between gap-3 pt-4 border-t">
            <div className="flex gap-3 ml-auto">
            <Button
              type="submit"
              disabled={!isFormValid()}
                className="bg-[#393CA0] hover:bg-[#393CA0]/90"
            >
                <Save className="h-4 w-4 mr-2" />
              {isNewMetric ? 'Add Metric' : 'Update Metric'}
            </Button>
            </div>
          </div>
        </form>
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2">Delete Metric</h3>
              <p className="mb-4 text-gray-700">Are you sure you want to delete this metric? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => { setShowDeleteConfirm(false); onDelete && onDelete(); onClose(); }}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 