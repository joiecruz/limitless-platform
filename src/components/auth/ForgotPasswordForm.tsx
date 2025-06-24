
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
  const [resetSent, setResetSent] = useState(false);
  const { loading, sendPasswordResetEmail } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    // Use our hook to send password reset email
    const success = await sendPasswordResetEmail(email);

    if (success) {
      setResetSent(true);
      // Keep the form open for a moment to show the success state
      setTimeout(() => {
        onCancel(); // Return to login form after a brief delay
      }, 3000);
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

      {resetSent ? (
        <div className="text-center text-sm p-4 bg-green-50 rounded-md">
          <p className="text-green-800 font-medium mb-2">Reset link sent!</p>
          <p className="text-gray-600">Check your inbox for instructions on how to reset your password.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};
