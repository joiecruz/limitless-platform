import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

interface BlogTagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function BlogTagsInput({ value, onChange, error }: BlogTagsInputProps) {
  const handleInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim().toLowerCase();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <FormLabel>Tags</FormLabel>
      <Input
        type="text"
        placeholder="Type a tag and press Enter"
        onKeyDown={handleInputChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-secondary/10 text-secondary px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}