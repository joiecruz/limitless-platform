import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { EditCaseStudyDialog } from "./EditCaseStudyDialog";
import { useCaseStudyOperations } from "./hooks/useCaseStudyOperations";
import { format } from "date-fns";

interface CaseStudyTableRowProps {
  caseStudy: {
    id: string;
    name: string;
    client: string | null;
    created_at: string;
  };
}

export function CaseStudyTableRow({ caseStudy }: CaseStudyTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { handleDelete } = useCaseStudyOperations();

  return (
    <>
      <TableRow>
        <TableCell>{caseStudy.name}</TableCell>
        <TableCell>{caseStudy.client || "-"}</TableCell>
        <TableCell>{format(new Date(caseStudy.created_at), "MMM d, yyyy")}</TableCell>
        <TableCell className="text-right space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(caseStudy.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <EditCaseStudyDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        caseStudyId={caseStudy.id}
      />
    </>
  );
}