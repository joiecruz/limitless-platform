
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { extractTokenFromUrl } from './useEmailConfirmation';

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
      console.log("Password reset redirect URL:", redirectTo);

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
      console.error("Password reset error:", error);
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
      // Get the token from the URL
      const token = extractTokenFromUrl();
      console.log("Updating password with token:", token ? "Token exists" : "No token found");

      // If there's no token, we can't proceed
      if (!token) {
        throw new Error("No valid reset token found. Please request a new password reset link.");
      }
      
      // Try to establish a session using the token
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (sessionError) {
        console.log("Failed to set session with token:", sessionError);
        throw sessionError;
      }
      
      // Now that we have a session, update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) {
        console.log("Failed to update password after setting session:", updateError);
        throw updateError;
      }
      
      console.log("Password updated successfully");
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
      console.error("Password update error:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
      
      // Redirect to sign in page with expired flag if token is invalid
      if (error.message?.includes('expired') || error.message?.includes('invalid token')) {
        setTimeout(() => {
          navigate('/signin?reset_expired=true');
        }, 2000);
      }
      
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
