import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnboardingData } from "../types";

interface Step1Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  loading?: boolean;
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

export function Step1({ onNext, data, loading }: Step1Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onNext({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      role: formData.get("role") as string,
      companySize: formData.get("companySize") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">Tell us about yourself</h2>
        <p className="text-muted-foreground">This helps us personalize your experience</p>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={data.firstName}
              required
              className="rounded-[5px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={data.lastName}
              required
              className="rounded-[5px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">What best describes you?</Label>
          <Select name="role" defaultValue={data.role} required>
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
          <Select name="companySize" defaultValue={data.companySize} required>
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
      </div>

      <Button type="submit" className="w-full rounded-[5px]" disabled={loading}>
        Continue
      </Button>
    </form>
  );
}
