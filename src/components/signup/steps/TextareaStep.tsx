import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextareaStepProps {
  title?: string;
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  loading?: boolean;
}

export function TextareaStep({
  title,
  label,
  name,
  value,
  placeholder,
  onChange,
  onSubmit,
  onPrev,
  loading
}: TextareaStepProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      )}
      <div>
        <Label htmlFor={name}>{label}</Label>
        <Textarea
          id={name}
          name={name}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 h-24"
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={onPrev} variant="outline">
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Creating Account..." : "Complete Sign Up"}
        </Button>
      </div>
    </div>
  );
}