import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnboardingData } from "../types";
import { PasswordInput } from "@/components/signup/components/PasswordInput";

interface PersonalInfoFieldsProps {
  formData: Pick<OnboardingData, "firstName" | "lastName" | "role" | "companySize" | "password">;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  isInvitedUser?: boolean;
}

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

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
];

export function PersonalInfoFields({ 
  formData, 
  handleInputChange, 
  handleSelectChange,
  isInvitedUser 
}: PersonalInfoFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="rounded-[5px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="rounded-[5px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">What best describes you?</Label>
        <Select 
          name="role" 
          value={formData.role} 
          onValueChange={(value) => handleSelectChange("role", value)}
          required
        >
          <SelectTrigger className="rounded-[5px]">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companySize">How many employees does your company have?</Label>
        <Select 
          name="companySize" 
          value={formData.companySize}
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

      {isInvitedUser && (
        <div className="space-y-2">
          <Label htmlFor="password">Set Your Password</Label>
          <PasswordInput
            value={formData.password || ""}
            onChange={handleInputChange}
            error=""
            disabled={false}
          />
        </div>
      )}
    </div>
  );
}