import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PageTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PageTitleInput({ value, onChange }: PageTitleInputProps) {
  return (
    <div>
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}