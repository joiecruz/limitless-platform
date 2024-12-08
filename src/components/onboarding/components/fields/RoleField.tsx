import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = [
  "Founder/CEO",
  "C-Level Executive",
  "Innovation Lead",
  "Manager",
  "Team Lead",
  "Employee",
  "Contributor",
  "Developer",
  "Analyst",
  "Consultant",
  "Project Manager",
  "Marketing Manager",
  "Sales Representative",
  "Customer Support",
  "Finance/Accountant",
  "IT Specialist",
  "Product Owner",
  "Designer",
  "Editor",
  "Reviewer",
  "Viewer",
  "Student",
  "Others"
];

interface RoleFieldProps {
  role: string;
  handleSelectChange: (name: string, value: string) => void;
}

export function RoleField({ role, handleSelectChange }: RoleFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">What best describes you?</Label>
      <Select 
        name="role" 
        value={role} 
        onValueChange={(value) => handleSelectChange("role", value)}
        required
      >
        <SelectTrigger className="rounded-[5px]">
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((roleOption) => (
            <SelectItem key={roleOption} value={roleOption}>
              {roleOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}