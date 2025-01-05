import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tool } from "@/types/tool";
import { BasicFields } from "./components/BasicFields";
import { DescriptionFields } from "./components/DescriptionFields";
import { UseCaseFields } from "./components/UseCaseFields";
import { UsageFields } from "./components/UsageFields";
import { FileUploadField } from "./components/FileUploadField";

interface ToolFormProps {
  onSubmit: (data: Partial<Tool>) => void;
  defaultValues?: Partial<Tool>;
  isLoading?: boolean;
}

export function ToolForm({ onSubmit, defaultValues, isLoading }: ToolFormProps) {
  const form = useForm<Partial<Tool>>({
    defaultValues: defaultValues || {
      name: "",
      category: "Innovation Process and Tools",
      type: "",
      price: 0,
      brief_description: "",
      long_description: "",
      use_case_1: "",
      use_case_2: "",
      use_case_3: "",
      how_to_use: "",
      when_to_use: "",
      cover_image: "",
      download_url: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicFields form={form} />
        
        <FileUploadField
          form={form}
          name="cover_image"
          label="Cover Image"
          accept="image/*"
          bucket="innovation-tools"
        />
        
        <FileUploadField
          form={form}
          name="download_url"
          label="Downloadable File"
          bucket="innovation-tools"
        />
        
        <DescriptionFields form={form} />
        <UseCaseFields form={form} />
        <UsageFields form={form} />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}