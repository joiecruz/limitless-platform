import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PagePublishToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function PagePublishToggle({ checked, onCheckedChange }: PagePublishToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="published"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor="published">Published</Label>
    </div>
  );
}