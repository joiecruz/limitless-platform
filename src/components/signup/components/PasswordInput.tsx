import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordRequirements } from "../steps/PasswordRequirements";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export function PasswordInput({ value, onChange, error, disabled }: PasswordInputProps) {
  return (
    <div className="w-full">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        className={`mt-1 ${error ? 'border-red-500' : ''}`}
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      <PasswordRequirements password={value} />
    </div>
  );
}