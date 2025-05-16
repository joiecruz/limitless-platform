
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { extractTokenFromUrl, extractEmailFromUrl } from './useEmailConfirmation';

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
      
      // Store the email in localStorage so we can use it for token verification later
      localStorage.setItem('passwordResetEmail', cleanEmail);
      
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

      // Get the email that might be needed for verification
      const email = extractEmailFromUrl();
      console.log("Email for verification:", email || "No email found");

      // If there's no token, we can't proceed
      if (!token) {
        throw new Error("No valid reset token found. Please request a new password reset link.");
      }

      // Try different approaches to use the token for password reset
      try {
        // First try: If we have email, use it with the token
        if (email) {
          console.log("Attempting to verify with email and token");
          // First, try to sign in with the OTP
          const { error: signInError } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'recovery',
          });
          
          if (signInError) {
            console.warn("Email+token verification failed:", signInError.message);
            // Continue anyway, we'll try other methods
          } else {
            console.log("Successfully verified with email and token");
          }
        } 
        // Second try: If no email or previous attempt failed, try token_hash method
        else {
          console.log("Attempting token_hash verification");
          try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery',
            });
            
            if (verifyError) {
              console.warn("Token hash verification failed:", verifyError.message);
            } else {
              console.log("Successfully verified with token_hash");
            }
          } catch (err) {
            console.warn("Token hash verification error:", err);
          }
        }
      } catch (verifyError) {
        console.warn("All token verification methods failed:", verifyError);
      }

      // Even if verification failed, try to update the password anyway
      // This might work if the token was valid but verification had other issues
      console.log("Attempting to update password");
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        // If updating with just the password fails, try one more time with the token
        if (email) {
          console.log("Attempting direct password update with recovery token");
          const { error: tokenUpdateError } = await supabase.auth.updateUser({
            email: email, 
            password: password,
          });
          
          if (tokenUpdateError) throw tokenUpdateError;
        } else {
          throw error;
        }
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      // Clear any stored email
      localStorage.removeItem('passwordResetEmail');

      // Redirect to sign in page after short delay
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
      
      success = true;
    } catch (error: any) {
      console.error("Password update error:", error);
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
