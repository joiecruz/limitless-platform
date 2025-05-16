
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
      // Get the token from the URL if it exists
      const token = extractTokenFromUrl();
      console.log("Updating password with token:", token ? "Token exists" : "No token found");

      // Get the email that might be needed for verification
      const email = extractEmailFromUrl();

      // If we have a token but no session, try to create one
      if (token) {
        const { data: currentSession } = await supabase.auth.getSession();
        
        if (!currentSession.session) {
          console.log("No active session, attempting to use token to update password");
          
          try {
            // We need to provide email for proper OTP verification if it's available
            if (email) {
              console.log("Using email and token for verification");
              const { error: verifyError } = await supabase.auth.verifyOtp({
                email: email,
                token: token,
                type: 'recovery',
              });
              
              if (verifyError) {
                console.error("Token verification with email error:", verifyError);
                // Continue anyway as updateUser may still work
              }
            } else {
              console.log("No email found for verification, trying token_hash method");
              
              // Try using token hash method when email is not available
              try {
                const { error: verifyError } = await supabase.auth.verifyOtp({
                  token_hash: token,
                  type: 'recovery',
                });
                
                if (verifyError) {
                  console.error("Token hash verification error:", verifyError);
                }
              } catch (verifyHashError) {
                console.warn("Token hash verification failed:", verifyHashError);
              }
            }
          } catch (verifyError) {
            console.warn("Token verification attempt failed:", verifyError);
            // Continue anyway as updateUser may still work
          }
        }
      }

      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

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
