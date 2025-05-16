
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { extractTokenFromUrl, extractEmailFromUrl, verifyResetToken } from './useEmailConfirmation';

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
      console.log("Email for password reset:", email || "No email found");

      // If there's no token, we can't proceed
      if (!token) {
        throw new Error("No valid reset token found. Please request a new password reset link.");
      }

      // Check if we have an active session already
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found, attempting to use token to update password");
        
        // Try to create a session from the token
        const isValid = await verifyResetToken(token, email);
        
        if (!isValid) {
          console.log("Token could not be verified, requesting new password reset");
          toast({
            title: "Reset Link Expired",
            description: "Your password reset link has expired. Please request a new one.",
            variant: "destructive",
          });
          
          setTimeout(() => {
            navigate('/signin?reset_expired=true');
          }, 2000);
          
          return false;
        }
      }

      // At this point we should have a valid session from the token verification
      // or a pre-existing session, so attempt to update the password
      console.log("Attempting to update password");
      
      // First try direct password update approach
      try {
        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (!error) {
          // Success!
          console.log("Password updated successfully");
          success = true;
        } else {
          // Handle specific errors
          if (error.status === 401 || error.message?.includes('session')) {
            throw error; // Let the catch block handle session errors
          } else {
            console.error("Password update error:", error);
            throw error;
          }
        }
      } catch (updateError: any) {
        console.log("Password update direct error:", updateError);
        
        // Special case for expired sessions
        if (updateError.message?.includes('session') || updateError.status === 401) {
          // Try second approach - send a new reset email
          if (email) {
            try {
              const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
              });
              
              if (!resetError) {
                toast({
                  title: "Session Expired",
                  description: "Your reset session has expired. We've sent you a new password reset link.",
                  variant: "destructive",
                });
                
                setTimeout(() => {
                  navigate('/signin?reset_sent=true');
                }, 2000);
                
                return false;
              }
            } catch (e) {
              console.error("Failed to send new password reset email:", e);
            }
          }
          
          // If we couldn't send a new email, show generic error
          toast({
            title: "Session Expired",
            description: "Your reset session has expired. Please request a new password reset link.",
            variant: "destructive",
          });
          
          setTimeout(() => {
            navigate('/signin?reset_expired=true');
          }, 2000);
          
          return false;
        }
        
        throw updateError;
      }

      if (success) {
        toast({
          title: "Password Updated",
          description: "Your password has been updated successfully. You can now sign in with your new password.",
        });

        // Clear any stored email
        localStorage.removeItem('passwordResetEmail');

        // Redirect to sign in page after short delay
        setTimeout(() => {
          navigate('/signin?reset_success=true');
        }, 1500);
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      
      // Check for specific error conditions
      if (error.message?.includes('expired') || error.message?.includes('invalid token')) {
        toast({
          title: "Reset Link Expired",
          description: "Your password reset link has expired. Please request a new one.",
          variant: "destructive",
        });
        setTimeout(() => {
          navigate('/signin?reset_expired=true');
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to update password",
          variant: "destructive",
        });
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
