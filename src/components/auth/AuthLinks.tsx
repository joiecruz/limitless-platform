import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthLinks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleForgotPassword = async () => {
    const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset password email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-center mt-4 space-y-2">
      <p className="text-sm text-gray-600">
        Don't have an account?{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </Button>
      </p>
      <p className="text-sm text-gray-600">
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </Button>
      </p>
    </div>
  );
};