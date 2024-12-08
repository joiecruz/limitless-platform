import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function CreateWorkspaceDialog() {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Coming Soon",
      description: "Create workspace feature is coming soon!",
    });
  };

  return (
    <Button variant="outline" className="w-full justify-start" onClick={handleClick}>
      + Create Workspace
    </Button>
  );
}