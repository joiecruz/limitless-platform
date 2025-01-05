import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CaseStudyForm } from "./CaseStudyForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EditCaseStudyDialogProps {
  caseStudyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCaseStudyDialog({ 
  caseStudyId, 
  open, 
  onOpenChange 
}: EditCaseStudyDialogProps) {
  const queryClient = useQueryClient();

  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ['case-study', caseStudyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('id', caseStudyId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const handleSuccess = () => {
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ['case-studies'] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Case Study</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <CaseStudyForm
            initialData={caseStudy}
            onSuccess={handleSuccess}
            isEdit
            caseStudyId={caseStudyId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}