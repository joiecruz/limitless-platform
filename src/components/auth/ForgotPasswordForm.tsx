
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordFormProps {
  onCancel: () => void;
  initialEmail?: string;
}

export function ForgotPasswordForm({ onCancel, initialEmail = '' }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Ensure we have an absolute URL for the redirect
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      
      console.log("Sending password reset to:", email);
      console.log("Redirect URL:", redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password",
      });
      
      // Return to login view
      onCancel();
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Forgot Password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            style={{ backgroundColor: "rgb(69, 66, 158)" }}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
