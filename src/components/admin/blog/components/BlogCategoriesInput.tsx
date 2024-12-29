import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

interface BlogCategoriesInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function BlogCategoriesInput({ value, onChange, error }: BlogCategoriesInputProps) {
  const handleInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newCategory = e.currentTarget.value.trim();
      if (!value.includes(newCategory)) {
        onChange([...value, newCategory]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    onChange(value.filter(category => category !== categoryToRemove));
  };

  return (
    <div className="space-y-2">
      <FormLabel>Categories</FormLabel>
      <Input
        type="text"
        placeholder="Type a category and press Enter"
        onKeyDown={handleInputChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((category) => (
          <span
            key={category}
            className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {category}
            <button
              type="button"
              onClick={() => removeCategory(category)}
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