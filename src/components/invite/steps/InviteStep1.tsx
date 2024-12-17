import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordRequirements } from "@/components/signup/steps/PasswordRequirements";

interface InviteStep1Props {
  onNext: (data: { password: string }) => void;
  data: { password: string };
  loading?: boolean;
}

export function InviteStep1({ onNext, data, loading }: InviteStep1Props) {
  const [password, setPassword] = useState(data.password || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      password,
    });
  };

  const isPasswordValid = () => {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /\d/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">Set Your Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordRequirements password={password} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !isPasswordValid()}>
          {loading ? "Setting up..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}