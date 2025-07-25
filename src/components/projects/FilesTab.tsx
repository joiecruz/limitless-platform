import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FilesTabProps {
  isLoading: boolean;
  onUploadFile: () => void;
}

export default function FilesTab({
  isLoading,
  onUploadFile,
}: FilesTabProps) {
  // Instructional box for Files tab
  const instructionBox = (
    <div className="flex items-center bg-white border rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex-1">
        <h2 className="text-md font-semibold mb-1">Project Files</h2>
        <p className="text-gray-600 text-sm">
          Upload and manage files that support your project implementation. Keep all your important documents in one place.
        </p>
      </div>
      <Button
        className="ml-6 bg-[#393CA0] hover:bg-[#393CA0]/90 text-white shadow-sm"
        onClick={onUploadFile}
      >
        <Plus className="mr-2 h-4 w-4" />
        Upload File
      </Button>
    </div>
  );

  if (isLoading) {
    return <>{instructionBox}</>;
  }

  // TODO: Replace with actual file list logic
  return (
    <>
      {instructionBox}
      <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">No files uploaded yet</h3>
          <p className="text-gray-500 mb-2">
            Start by uploading files to support your project implementation.
          </p>
        </div>
      </div>
    </>
  );
} 