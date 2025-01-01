import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";
import { useState } from "react";

interface BlogCategorySelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function BlogCategorySelect({ value, onChange, error }: BlogCategorySelectProps) {
  const [open, setOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (value.includes(category)) {
      onChange(value.filter((c) => c !== category));
    } else {
      onChange([...value, category]);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length === 0
              ? "Select categories..."
              : `${value.length} selected`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {BLOG_CATEGORIES.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => toggleCategory(category)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(category) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((category) => (
          <div
            key={category}
            className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {category}
            <button
              type="button"
              onClick={() => onChange(value.filter((c) => c !== category))}
              className="hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}