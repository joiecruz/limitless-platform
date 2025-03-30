
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { blogCategories } from "@/constants/blogCategories";

interface BlogCategorySelectProps {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  error?: string;
}

export function BlogCategorySelect({ value = [], onChange, error }: BlogCategorySelectProps) {
  const [open, setOpen] = useState(false);
  // Ensure value is always an array
  const selectedCategories = Array.isArray(value) ? value : [];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="categories">Categories</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategories.length > 0
              ? `${selectedCategories.length} categories selected`
              : "Select categories"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {blogCategories.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={() => {
                    toggleCategory(category);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(category) ? "opacity-100" : "opacity-0"
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
    </div>
  );
}
