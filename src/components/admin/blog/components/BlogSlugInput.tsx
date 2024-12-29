import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlogSlugInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function BlogSlugInput({ value, onChange, error }: BlogSlugInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="slug">Slug</Label>
      <Input
        id="slug"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}