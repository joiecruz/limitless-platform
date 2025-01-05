import { Button } from "@/components/ui/button";

interface BlogFormActionsProps {
  onClose: () => void;
  isSubmitting?: boolean;
}

export function BlogFormActions({ onClose, isSubmitting }: BlogFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        Save Changes
      </Button>
    </div>
  );
}