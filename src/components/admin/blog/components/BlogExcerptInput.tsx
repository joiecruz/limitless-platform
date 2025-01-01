import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BlogExcerptInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function BlogExcerptInput({ value, onChange, error }: BlogExcerptInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="excerpt">Excerpt</Label>
      <Textarea
        id="excerpt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}