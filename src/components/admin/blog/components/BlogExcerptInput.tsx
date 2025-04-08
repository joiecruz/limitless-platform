
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BlogExcerptInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  description?: string;
}

export function BlogExcerptInput({ 
  value, 
  onChange, 
  error,
  label = "Excerpt",
  description
}: BlogExcerptInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="excerpt">{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <Textarea
        id="excerpt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500" : ""}
        placeholder="Brief summary of the article"
        rows={4}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
