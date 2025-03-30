
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface BlogTagsInputProps {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  error?: string;
}

export function BlogTagsInput({ value = [], onChange, error }: BlogTagsInputProps) {
  const [tagInput, setTagInput] = useState("");
  // Ensure value is always an array
  const tags = Array.isArray(value) ? value : [];

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      
      <div className="flex gap-2">
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag"
          className={error ? "border-red-500" : ""}
        />
        <Button type="button" onClick={addTag} variant="outline">
          Add
        </Button>
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
