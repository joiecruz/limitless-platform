
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { usePasswordReset } from "@/hooks/usePasswordReset";

interface ForgotPasswordFormProps {
  onCancel: () => void;
  initialEmail?: string;
}

export const ForgotPasswordForm = ({ onCancel, initialEmail = "" }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState(initialEmail);
  const { loading, sendPasswordResetEmail } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store the email in localStorage so we can use it for token verification later
    localStorage.setItem('passwordResetEmail', email);
    
    // Use our hook to send password reset email
    const success = await sendPasswordResetEmail(email);
    
    if (success) {
      // Return to login form after successful submission
      onCancel(); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reset your password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we'll send you a password reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            variant="default"
            style={{ backgroundColor: "rgb(69, 66, 158)" }}
          >
            {loading ? "Sending..." : "Reset password"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Back to sign in
          </Button>
        </div>
      </form>
    </div>
  );
};
