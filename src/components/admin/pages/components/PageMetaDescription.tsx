
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface PageMetaDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export function PageMetaDescription({ value, onChange }: PageMetaDescriptionProps) {
  const [charCount, setCharCount] = useState(value?.length || 0);
  
  useEffect(() => {
    setCharCount(value?.length || 0);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setCharCount(newValue.length);
  };

  const getCounterColor = () => {
    if (charCount === 0) return "text-muted-foreground";
    if (charCount < 120) return "text-amber-500";
    if (charCount <= 160) return "text-green-600";
    return "text-red-500";
  };

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
              <p className="w-80">This description appears in search results and when this page is shared on social media. Keep it between 120-160 characters for best results.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Textarea
        id="meta_description"
        value={value}
        onChange={handleChange}
        placeholder="Brief description for search engines and social media (recommended 120-160 characters)"
        className="mt-1"
        maxLength={160}
      />
      <div className={`text-xs ${getCounterColor()} mt-1 flex justify-between`}>
        <span>{charCount}/160 characters</span>
        {charCount < 120 && <span>Add more characters for better SEO</span>}
        {charCount > 160 && <span>Too long, consider shortening</span>}
        {charCount >= 120 && charCount <= 160 && <span>Optimal length ✓</span>}
      </div>
    </div>
  );
}
