import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupData } from "./types";

interface StepProps {
  formData: SignupData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  loading?: boolean;
}

export const Step1 = ({ formData, handleInputChange, nextStep }: StepProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="email">Work Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleInputChange}
        placeholder="you@company.com"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleInputChange}
        placeholder="••••••••"
        className="mt-1"
      />
      <p className="text-xs text-gray-500 mt-1">
        Must be at least 6 characters
      </p>
    </div>
    <Button type="button" onClick={nextStep} className="w-full">
      Continue
    </Button>
  </div>
);

export const Step2 = ({ formData, handleInputChange, nextStep, prevStep }: StepProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="firstName">First Name</Label>
      <Input
        id="firstName"
        name="firstName"
        required
        value={formData.firstName}
        onChange={handleInputChange}
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="lastName">Last Name</Label>
      <Input
        id="lastName"
        name="lastName"
        required
        value={formData.lastName}
        onChange={handleInputChange}
        className="mt-1"
      />
    </div>
    <div className="flex gap-2">
      <Button type="button" onClick={prevStep} variant="outline">
        Back
      </Button>
      <Button type="button" onClick={nextStep} className="flex-1">
        Continue
      </Button>
    </div>
  </div>
);

export const Step3 = ({ formData, handleInputChange, nextStep, prevStep }: StepProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="workspaceName">Workspace Name</Label>
      <Input
        id="workspaceName"
        name="workspaceName"
        required
        value={formData.workspaceName}
        onChange={handleInputChange}
        placeholder="Acme Corp"
        className="mt-1"
      />
    </div>
    <div className="flex gap-2">
      <Button type="button" onClick={prevStep} variant="outline">
        Back
      </Button>
      <Button type="button" onClick={nextStep} className="flex-1">
        Continue
      </Button>
    </div>
  </div>
);

export const Step4 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="role">What best describes you?</Label>
      <Select
        value={formData.role}
        onValueChange={(value) => handleSelectChange("role", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="founder">Founder/CEO</SelectItem>
          <SelectItem value="executive">Executive</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="individual">Individual Contributor</SelectItem>
          <SelectItem value="student">Student</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex gap-2">
      <Button type="button" onClick={prevStep} variant="outline">
        Back
      </Button>
      <Button type="button" onClick={nextStep} className="flex-1">
        Continue
      </Button>
    </div>
  </div>
);

export const Step5 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="companySize">How many employees do you have?</Label>
      <Select
        value={formData.companySize}
        onValueChange={(value) => handleSelectChange("companySize", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select company size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Just me</SelectItem>
          <SelectItem value="2-10">2-10</SelectItem>
          <SelectItem value="11-50">11-50</SelectItem>
          <SelectItem value="51-200">51-200</SelectItem>
          <SelectItem value="201-500">201-500</SelectItem>
          <SelectItem value="501+">501+</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex gap-2">
      <Button type="button" onClick={prevStep} variant="outline">
        Back
      </Button>
      <Button type="button" onClick={nextStep} className="flex-1">
        Continue
      </Button>
    </div>
  </div>
);

export const Step6 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="referralSource">How did you hear about us?</Label>
      <Select
        value={formData.referralSource}
        onValueChange={(value) => handleSelectChange("referralSource", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="search">Search Engine</SelectItem>
          <SelectItem value="social">Social Media</SelectItem>
          <SelectItem value="friend">Friend/Colleague</SelectItem>
          <SelectItem value="blog">Blog/Article</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex gap-2">
      <Button type="button" onClick={prevStep} variant="outline">
        Back
      </Button>
      <Button type="button" onClick={nextStep} className="flex-1">
        Continue
      </Button>
    </div>
  </div>
);

export const Step7 = ({ formData, handleInputChange, prevStep, loading }: StepProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="goals">What do you want to accomplish?</Label>
      <Textarea
        id="goals"
        name="goals"
        required
        value={formData.goals}
        onChange={handleInputChange}
        placeholder="Tell us about your goals..."
        className="mt-1 h-24"
      />
    </div>
    <div className="flex gap-2">
      <Button type="button" onClick={prevStep} variant="outline">
        Back
      </Button>
      <Button type="submit" className="flex-1" disabled={loading}>
        {loading ? "Creating Account..." : "Complete Sign Up"}
      </Button>
    </div>
  </div>
);