import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CaseStudyForm } from "@/components/admin/case-studies/CaseStudyForm";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditCaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ['case-study', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="p-6">
        <p>Case study not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/content")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </Button>
        <h1 className="text-2xl font-bold">Edit Case Study</h1>
      </div>
      
      <CaseStudyForm 
        initialData={caseStudy}
        onSuccess={() => navigate("/admin/content")}
        isEdit
        caseStudyId={id}
      />
    </div>
  );
}