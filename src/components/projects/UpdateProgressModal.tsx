import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyMetric } from '@/hooks/useImplement';
import { Save, X } from 'lucide-react';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: KeyMetric | null;
  onUpdate: (updatedMetric: KeyMetric) => void;
}

export default function UpdateProgressModal({
  isOpen,
  onClose,
  metric,
  onUpdate,
}: UpdateProgressModalProps) {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [updateDate, setUpdateDate] = useState<string>('');

  // Initialize form when modal opens
  useEffect(() => {
    if (metric) {
      setCurrentValue(metric.lastUpdated.value);
      setUpdateDate(new Date().toISOString().split('T')[0]);
    }
  }, [metric]);

  const calculateProgress = () => {
    if (!metric || metric.target === 0) return 0;
    return Math.min(100, Math.max(0, (currentValue / metric.target) * 100));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metric) return;

    const updatedMetric: KeyMetric = {
      ...metric,
      lastUpdated: {
        value: currentValue,
        date: updateDate,
      },
      progress: Math.round(calculateProgress()),
    };

    onUpdate(updatedMetric);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const today = new Date().toISOString().split('T')[0];
  const isFormValid = () => {
    if (currentValue < 0) return false;
    if (metric && currentValue > metric.target) return false;
    if (updateDate > today) return false;
    return true;
  };

  if (!metric) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-bold">
            Update Progress
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metric Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-gray-900">{metric.indicator}</h4>
            <p className="text-sm text-gray-600">
              Target: {metric.target} {metric.unit}
            </p>
            <p className="text-sm text-gray-600">
              Due: {metric.due}
            </p>
          </div>

          {/* Progress Input Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
          {/* Current Value Input */}
          <div className="space-y-2">
            <Label htmlFor="currentValue" className="text-sm font-medium">
              Current Value
            </Label>
            <Input
              id="currentValue"
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(Number(e.target.value))}
              placeholder="0"
              min={0}
              max={metric.target}
              required
            />
                {currentValue < 0 && (
                  <div className="text-red-600 text-xs">Value cannot be negative.</div>
                )}
                {metric && currentValue > metric.target && (
                  <div className="text-red-600 text-xs">Value cannot exceed target ({metric.target}).</div>
                )}
            <p className="text-xs text-gray-500">
              Unit: {metric.unit}
            </p>
          </div>

          {/* Update Date */}
          <div className="space-y-2">
            <Label htmlFor="updateDate" className="text-sm font-medium">
              Update Date
            </Label>
            <Input
              id="updateDate"
              type="date"
              value={updateDate}
              onChange={(e) => setUpdateDate(e.target.value)}
              required
            />
                {updateDate > today && (
                  <div className="text-red-600 text-xs">Update date cannot be in the future.</div>
                )}
              </div>
          </div>

          {/* Progress Display */}
            <div className="bg-white rounded-lg p-4 border">
              <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-lg font-bold text-gray-900">
                {Math.round(calculateProgress())}%
              </span>
            </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(calculateProgress())}`}
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
              {currentValue} / {metric.target} {metric.unit}
                  </span>
                  <span className="text-gray-500">
                    {metric.target - currentValue} remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="bg-[#393CA0] hover:bg-[#393CA0]/90"
              disabled={!isFormValid()}
            >
              <Save className="h-4 w-4 mr-2" />
              Update Progress
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 