import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  hasMore: boolean;
  label?: string;
}

/**
 * Shared "Load more" pagination control for list pages.
 * Renders nothing once `hasMore` is false.
 */
export function LoadMoreButton({
  onClick,
  isLoading = false,
  hasMore,
  label = "Load more",
}: LoadMoreButtonProps) {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center mt-12">
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="min-w-[160px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading…
          </>
        ) : (
          label
        )}
      </Button>
    </div>
  );
}
