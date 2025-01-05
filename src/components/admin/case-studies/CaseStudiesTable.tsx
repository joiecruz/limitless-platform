import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaseStudyTableRow } from "./CaseStudyTableRow";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CaseStudiesTable() {
  const { toast } = useToast();
  
  const { data: caseStudies, isLoading, error } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
      console.log("Fetching case studies...");
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching case studies:', error);
        throw error;
      }
      
      console.log("Fetched case studies:", data);
      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading case studies",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Failed to load case studies. Please try again.
      </div>
    );
  }

  if (!caseStudies?.length) {
    return (
      <div className="text-center p-4 text-gray-500">
        No case studies found. Create one to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {caseStudies.map((caseStudy) => (
          <CaseStudyTableRow key={caseStudy.id} caseStudy={caseStudy} />
        ))}
      </TableBody>
    </Table>
  );
}