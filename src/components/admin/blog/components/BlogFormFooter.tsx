import { Button } from "@/components/ui/button";

interface BlogFormFooterProps {
  isLoading: boolean;
}

export function BlogFormFooter({ isLoading }: BlogFormFooterProps) {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? "Saving..." : "Save"}
    </Button>
  );
}