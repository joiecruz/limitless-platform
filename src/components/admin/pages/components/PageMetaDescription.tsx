
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PageMetaDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export function PageMetaDescription({ value, onChange }: PageMetaDescriptionProps) {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="meta_description">Meta Description</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80">This description appears in search results and when this page is shared on social media. Keep it under 160 characters for best results.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Textarea
        id="meta_description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Brief description for search engines and social media (recommended 120-160 characters)"
        className="mt-1"
        maxLength={160}
      />
      <div className="text-xs text-muted-foreground mt-1">
        {value.length}/160 characters
      </div>
    </div>
  );
}
