import { useState } from 'react';
import { AlertCircle, Upload, X } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReportIssueProps {
  buttonClassName?: string;
}

export function ReportIssue({
  buttonClassName = 'nav-item',
}: ReportIssueProps) {
  const { toast } = useToast();
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({
    title: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You must be logged in to report an issue.',
          variant: 'destructive',
        });
        return;
      }

      // Upload file if present
      let fileUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `issue-attachments/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('user-uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        fileUrl = filePath;
      }

      // Store issue in database
      const { error } = await supabase.from('issue_reports').insert({
        user_id: user.id,
        title: issueData.title,
        description: issueData.description,
        attachment_url: fileUrl,
        status: 'pending',
      });

      if (error) throw error;

      // Success message
      toast({
        title: 'Issue reported',
        description: "Thank you for your feedback. We'll look into it.",
      });

      // Reset form and close modal
      setIssueData({ title: '', description: '' });
      setFile(null);
      setIssueModalOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error submitting issue',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];

      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Check file type
      const fileType = selectedFile.type;
      const validTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/zip',
      ];

      if (!validTypes.includes(fileType)) {
        toast({
          title: 'Invalid file type',
          description: 'Only PNG, JPG, PDF, and ZIP files are allowed',
          variant: 'destructive',
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Check file type
      const fileType = selectedFile.type;
      const validTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/zip',
      ];

      if (!validTypes.includes(fileType)) {
        toast({
          title: 'Invalid file type',
          description: 'Only PNG, JPG, PDF, and ZIP files are allowed',
          variant: 'destructive',
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
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
        <DialogContent className="sm:max-w-[500px]">
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

            <div className="space-y-2">
              <Label htmlFor="file-upload">Attachment (Optional)</Label>
              <div
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#393CA0] bg-[#393CA0]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf,.zip"
                  onChange={handleFileChange}
                />

                {file ? (
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500 truncate max-w-[350px]">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Upload className="h-6 w-6 mx-auto text-gray-400" />
                    <p className="mt-1 text-sm text-gray-500">
                      Drag and drop a file here, or click to select
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supported formats: PNG, JPG, PDF, ZIP (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIssueModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
