import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BlogMetaDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function BlogMetaDescription({ value, onChange, error }: BlogMetaDescriptionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="metaDescription">Meta Description</Label>
      <Textarea
        id="metaDescription"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}