import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
];

interface CompanySizeFieldProps {
  companySize: string;
  handleSelectChange: (name: string, value: string) => void;
}

export function CompanySizeField({ companySize, handleSelectChange }: CompanySizeFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="companySize">How many employees does your company have?</Label>
      <Select 
        name="companySize" 
        value={companySize}
        onValueChange={(value) => handleSelectChange("companySize", value)}
        required
      >
        <SelectTrigger className="rounded-[5px]">
          <SelectValue placeholder="Select company size" />
        </SelectTrigger>
        <SelectContent>
          {COMPANY_SIZES.map((size) => (
            <SelectItem key={size} value={size}>
              {size} employees
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}