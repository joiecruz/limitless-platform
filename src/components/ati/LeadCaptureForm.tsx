import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  organization: z.string().trim().min(1, "Required").max(120),
  referralSource: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof schema>;

interface LeadCaptureFormProps {
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
  submitting: boolean;
}

export function LeadCaptureForm({ onSubmit, submitting }: LeadCaptureFormProps) {
  const [values, setValues] = useState<LeadFormValues>({
    firstName: "",
    email: "",
    organization: "",
    referralSource: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) errs[err.path[0] as string] = err.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    await onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First name</Label>
        <Input
          id="firstName"
          value={values.firstName}
          onChange={(e) => setValues({ ...values, firstName: e.target.value })}
          maxLength={80}
          required
        />
        {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
      </div>
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          maxLength={255}
          required
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="organization">Organization / School</Label>
        <Input
          id="organization"
          value={values.organization}
          onChange={(e) => setValues({ ...values, organization: e.target.value })}
          maxLength={120}
          required
        />
        {errors.organization && <p className="text-sm text-red-600 mt-1">{errors.organization}</p>}
      </div>
      <div>
        <Label htmlFor="referralSource">How did you hear about us? <span className="text-gray-400 font-normal">(optional)</span></Label>
        <Select
          value={values.referralSource || undefined}
          onValueChange={(v) => setValues({ ...values, referralSource: v })}
        >
          <SelectTrigger id="referralSource">
            <SelectValue placeholder="Select one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Google">Google</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
            <SelectItem value="Event/Workshop">Event/Workshop</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90"
      >
        {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Get my full results →
      </Button>
      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to receive your results and occasional updates from Limitless Lab. We respect your privacy.
      </p>
    </form>
  );
}
