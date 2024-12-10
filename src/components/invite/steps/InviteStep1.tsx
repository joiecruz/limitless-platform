import { OnboardingData } from "../../onboarding/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InviteStep1Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  loading?: boolean;
}

export function InviteStep1({ onNext, data, loading }: InviteStep1Props) {
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");
  const [password, setPassword] = useState(data.password || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      firstName,
      lastName,
      password,
    });
  };

  const isValid = firstName && lastName && password;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Set Your Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !isValid}>
          {loading ? "Loading..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}