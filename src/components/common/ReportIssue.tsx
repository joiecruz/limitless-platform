import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

interface ReportIssueProps {
  buttonClassName?: string;
}

export function ReportIssue({
  buttonClassName = 'nav-item',
}: ReportIssueProps) {
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({ title: '', description: '' });

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the logic to send the issue to your backend
    console.log('Issue submitted:', issueData);
    // Reset form and close modal
    setIssueData({ title: '', description: '' });
    setIssueModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIssueModalOpen(true)}
        className={buttonClassName}
        data-sidebar="menu-button"
      >
        <AlertCircle className="h-5 w-5" />
        Report an Issue
      </button>

      {/* Report Issue Modal */}
      <Dialog open={issueModalOpen} onOpenChange={setIssueModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitIssue} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issue-title">Issue Title</Label>
              <Input
                id="issue-title"
                placeholder="Brief description of the issue"
                value={issueData.title}
                onChange={e =>
                  setIssueData({ ...issueData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-description">Description</Label>
              <Textarea
                id="issue-description"
                placeholder="Please provide details about the issue..."
                className="min-h-[120px]"
                value={issueData.description}
                onChange={e =>
                  setIssueData({ ...issueData, description: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIssueModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Issue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
