import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PageMetaDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export function PageMetaDescription({ value, onChange }: PageMetaDescriptionProps) {
  return (
    <div>
      <Label htmlFor="meta_description">Meta Description</Label>
      <Textarea
        id="meta_description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}