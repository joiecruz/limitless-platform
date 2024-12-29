import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BlogPublishToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function BlogPublishToggle({ value, onChange }: BlogPublishToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="published"
        checked={value}
        onCheckedChange={onChange}
      />
      <Label htmlFor="published">Published</Label>
    </div>
  );
}