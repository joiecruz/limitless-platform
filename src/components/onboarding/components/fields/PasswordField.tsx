import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/signup/components/PasswordInput";

interface PasswordFieldProps {
  password: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordField({ password, handleInputChange }: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">Set Your Password</Label>
      <PasswordInput
        value={password}
        onChange={handleInputChange}
        error=""
        disabled={false}
      />
    </div>
  );
}