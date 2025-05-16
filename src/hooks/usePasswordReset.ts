
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

      // We'll try multiple methods to update the password - this is our new approach
      console.log("Attempting direct password update through multiple methods");
      
      // Method 1: Using direct setSession first
      try {
        // Try to establish a session using the token
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });
        
        if (sessionError) {
          console.log("Failed to set session with token:", sessionError);
        } else if (sessionData?.session) {
          console.log("Successfully set session, now updating password");
          
          // Now that we have a session, update the password
          const { error: updateError } = await supabase.auth.updateUser({
            password: password
          });
          
          if (!updateError) {
            console.log("Password updated successfully via setSession method");
            success = true;
          } else {
            console.log("Failed to update password after setting session:", updateError);
          }
        }
      } catch (sessionMethodError) {
        console.log("Session method failed:", sessionMethodError);
      }
      
      // If first method failed, try another
      if (!success) {
        // Method 2: Try using the resetPassword API directly with the token
        try {
          const { error } = await fetch(`${supabase.auth.url}/recover`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabase.supabaseKey,
            },
            body: JSON.stringify({
              token,
              password,
            }),
          }).then(res => res.json());
          
          if (!error) {
            console.log("Password updated successfully via direct API call");
            success = true;
          } else {
            console.log("Direct API call failed:", error);
          }
        } catch (apiError) {
          console.log("API method failed:", apiError);
        }
      }
      
      // Method 3: Fallback to older versions of Supabase
      if (!success && email) {
        try {
          // For some versions of Supabase, we need to use the recovery flow
          console.log("Trying email recovery flow method");
          
          // First try to get session
          const { error: recoveryError } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'recovery'
          });
          
          if (!recoveryError) {
            // Now update password
            const { error: updateError } = await supabase.auth.updateUser({
              password
            });
            
            if (!updateError) {
              console.log("Password updated successfully via email recovery flow");
              success = true;
            } else {
              console.log("Password update failed after recovery flow:", updateError);
            }
          } else {
            console.log("Recovery flow verification failed:", recoveryError);
          }
        } catch (recoveryError) {
          console.log("Recovery method failed:", recoveryError);
        }
      }

      // If everything failed, inform the user
      if (!success) {
        toast({
          title: "Password Reset Failed",
          description: "The password reset link may have expired. Please request a new one.",
          variant: "destructive",
        });
        
        // Redirect to sign in page with expired flag
        setTimeout(() => {
          navigate('/signin?reset_expired=true');
        }, 2000);
        
        return false;
      }

      // Success case
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
