import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PageSlugInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PageSlugInput({ value, onChange }: PageSlugInputProps) {
  return (
    <div>
      <Label htmlFor="slug">Slug</Label>
      <Input
        id="slug"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}