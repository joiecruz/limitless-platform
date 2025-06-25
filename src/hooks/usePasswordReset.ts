
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to send a password reset email
  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    if (!email || !email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    let success = false;

    try {
      const cleanEmail = email.toLowerCase().trim();

      // Get current origin for proper redirect
      const redirectTo = `${window.location.origin}/reset-password`;

      // Use Supabase Auth API to send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectTo,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for a password reset link. If you don't see it, check your spam folder.",
      });

      success = true;
    } catch (error: any) {
      
      toast({
        title: "Error",
        description: error.message || "Failed to send reset password email",
        variant: "destructive",
      });
      success = false;
    } finally {
      setLoading(false);
    }

    return success;
  };

  // Function to update password using reset token
  const updatePassword = async (password: string): Promise<boolean> => {
    setLoading(true);
    let success = false;

    try {
      // Using Supabase's updateUser API to update the password
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      
      success = true;

      // Success case
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully. You can now sign in with your new password.",
      });

      // Redirect to sign in page after short delay
      setTimeout(() => {
        navigate('/signin?reset_success=true');
      }, 1500);

    } catch (error: any) {
      

      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });

      success = false;
    } finally {
      setLoading(false);
    }

    return success;
  };

  return {
    loading,
    sendPasswordResetEmail,
    updatePassword
  };
}
