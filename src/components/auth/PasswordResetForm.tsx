
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordResetFormProps {
  password: string;
  confirmPassword: string;
  passwordError: string;
  loading: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PasswordResetForm({
  password,
  confirmPassword,
  passwordError,
  loading,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: PasswordResetFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className="w-full"
          minLength={6}
        />
      </div>
      
      <div>
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
          className="w-full"
          minLength={6}
        />
        {passwordError && (
          <p className="text-sm text-red-500 mt-1">{passwordError}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
        style={{ backgroundColor: "rgb(69, 66, 158)" }}
      >
        {loading ? "Updating..." : "Set new password"}
      </Button>
    </form>
  );
}
