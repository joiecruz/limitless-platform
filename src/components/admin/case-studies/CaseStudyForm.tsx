import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CaseStudyImagePreview } from "./components/CaseStudyImagePreview";

interface CaseStudyFormProps {
  initialData?: {
    name: string;
    slug: string;
    client?: string;
    description?: string;
    services?: string[];
    sdgs?: string[];
    problem_opportunity?: string;
    approach?: string;
    impact?: string;
    quote_from_customer?: string;
    cover_photo?: string;
    additional_photo1?: string;
    additional_photo2?: string;
  };
  onSuccess?: () => void;
  isEdit?: boolean;
  caseStudyId?: string;
}

export function CaseStudyForm({ 
  initialData, 
  onSuccess,
  isEdit,
  caseStudyId 
}: CaseStudyFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    client: initialData?.client || "",
    description: initialData?.description || "",
    services: initialData?.services || [],
    sdgs: initialData?.sdgs || [],
    problem_opportunity: initialData?.problem_opportunity || "",
    approach: initialData?.approach || "",
    impact: initialData?.impact || "",
    quote_from_customer: initialData?.quote_from_customer || "",
    cover_photo: initialData?.cover_photo || "",
    additional_photo1: initialData?.additional_photo1 || "",
    additional_photo2: initialData?.additional_photo2 || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.slug) newErrors.slug = "Slug is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEdit && caseStudyId) {
        const { error } = await supabase
          .from('case_studies')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', caseStudyId);

        if (error) throw error;

        toast({
          title: "Case study updated",
          description: "The case study has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('case_studies')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Case study created",
          description: "The case study has been created successfully.",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: `Error ${isEdit ? 'updating' : 'creating'} case study`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className={errors.slug ? "border-red-500" : ""}
          />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
        </div>

        <div>
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <CaseStudyImagePreview
          label="Cover Photo"
          value={formData.cover_photo}
          onChange={(value) => setFormData(prev => ({ ...prev, cover_photo: value }))}
        />

        <div>
          <Label htmlFor="problem">Problem/Opportunity</Label>
          <Textarea
            id="problem"
            value={formData.problem_opportunity}
            onChange={(e) => setFormData(prev => ({ ...prev, problem_opportunity: e.target.value }))}
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="approach">Approach</Label>
          <Textarea
            id="approach"
            value={formData.approach}
            onChange={(e) => setFormData(prev => ({ ...prev, approach: e.target.value }))}
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="impact">Impact</Label>
          <Textarea
            id="impact"
            value={formData.impact}
            onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="quote">Customer Quote</Label>
          <Textarea
            id="quote"
            value={formData.quote_from_customer}
            onChange={(e) => setFormData(prev => ({ ...prev, quote_from_customer: e.target.value }))}
            rows={3}
          />
        </div>

        <CaseStudyImagePreview
          label="Additional Photo 1"
          value={formData.additional_photo1}
          onChange={(value) => setFormData(prev => ({ ...prev, additional_photo1: value }))}
        />

        <CaseStudyImagePreview
          label="Additional Photo 2"
          value={formData.additional_photo2}
          onChange={(value) => setFormData(prev => ({ ...prev, additional_photo2: value }))}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEdit ? 'Update Case Study' : 'Create Case Study'}
      </Button>
    </form>
  );
}