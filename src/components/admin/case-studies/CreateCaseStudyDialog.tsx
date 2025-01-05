import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CaseStudyForm } from "./CaseStudyForm";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function CreateCaseStudyDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ['case-studies'] });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Case Study
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Case Study</DialogTitle>
        </DialogHeader>
        <CaseStudyForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}