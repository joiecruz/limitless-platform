import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CaseStudyImagePreviewProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CaseStudyImagePreview({ label, value, onChange, error }: CaseStudyImagePreviewProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-4">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Image URL"
          className={error ? "border-red-500" : ""} 
        />
        {value && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}