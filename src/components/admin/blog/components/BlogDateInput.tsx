
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface BlogDateInputProps {
  label: string;
  value: Date | string | undefined;
  onChange: (date: string) => void;
  error?: string;
  description?: string;
}

export function BlogDateInput({ 
  label, 
  value, 
  onChange, 
  error,
  description
}: BlogDateInputProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      onChange(newDate.toISOString());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={label.toLowerCase().replace(/\s+/g, '-')}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : `Select ${label.toLowerCase()}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
