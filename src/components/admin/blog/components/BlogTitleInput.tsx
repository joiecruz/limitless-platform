import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlogTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function BlogTitleInput({ value, onChange, error }: BlogTitleInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}