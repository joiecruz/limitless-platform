
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { Eye, EyeOff } from "lucide-react";
import { extractTokenFromUrl } from '@/hooks/useEmailConfirmation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [validToken, setValidToken] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Function to check for and validate token
    const checkResetToken = async () => {
      try {
        setVerifying(true);
        console.log("Checking for reset token...");
        
        // Extract token from URL using our utility
        const accessToken = extractTokenFromUrl();
        setTokenFromUrl(accessToken);
        
        // Check if we have a token type
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        let tokenType = hashParams.get('type') || queryParams.get('type') || 'recovery';
        
        // Try to get email from URL or hash
        const email = hashParams.get('email') || queryParams.get('email');
        if (email) {
          setUserEmail(email);
          // Store email in localStorage for the updatePassword function
          localStorage.setItem('passwordResetEmail', email);
        }
        
        console.log("Token validation:", {
          hasToken: !!accessToken,
          tokenType,
          email,
          fromHash: !!hashParams.get('access_token'),
          fromQuery: !!queryParams.get('token')
        });

        // No token found in either location
        if (!accessToken) {
          console.error("No reset token found in URL");
          toast({
            title: "Invalid Reset Link",
            description: "This password reset link is invalid or has expired. Please request a new one.",
            variant: "destructive",
          });
          // Don't redirect immediately, allow user to see message and try again if needed
          setValidToken(false);
          return;
        }

        // Try to verify the token/session
        try {
          // Check if we already have a valid session
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData.session) {
            console.log("Existing session found");
            setValidToken(true);
          } else {
            console.log("No session found, trying to verify token");
            
            // Try different approaches to verify the token
            let tokenVerified = false;
            
            // Approach 1: Try to verify OTP if we have an email
            if (email) {
              try {
                const { error: verifyError } = await supabase.auth.verifyOtp({
                  email: email,
                  token: accessToken,
                  type: 'recovery',
                });
                
                if (!verifyError) {
                  console.log("Token verified with verifyOtp");
                  tokenVerified = true;
                } else {
                  console.warn("verifyOtp error:", verifyError);
                }
              } catch (verifyError) {
                console.warn("verifyOtp attempt failed:", verifyError);
              }
            }
            
            // Approach 2: Check if we can set session from token
            if (!tokenVerified && hashParams.get('refresh_token')) {
              try {
                const { error: sessionError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: hashParams.get('refresh_token') || '',
                });
                
                if (!sessionError) {
                  console.log("Session set successfully");
                  tokenVerified = true;
                } else {
                  console.warn("setSession error:", sessionError);
                }
              } catch (sessionError) {
                console.warn("setSession attempt failed:", sessionError);
              }
            }
            
            // Set token validity based on verification result
            setValidToken(tokenVerified);
            
            // If we couldn't verify the token but we have one, still allow the attempt
            // The updateUser API will be the final verification
            if (!tokenVerified && accessToken) {
              console.log("Token not verified but present - will try during password update");
              setValidToken(true);
            }
          }
        } catch (error: any) {
          console.error("Token verification error:", error);
          toast({
            title: "Error",
            description: "There was a problem validating your reset link. You can still attempt to reset your password.",
            variant: "destructive",
          });
          // We'll still let them try if the token is present
          setValidToken(!!accessToken);
        }
      } finally {
        setVerifying(false);
      }
    };

    checkResetToken();
  }, [navigate, toast]);

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      // If we have a token from URL but validation failed, try again directly here
      if (tokenFromUrl && !validToken && userEmail) {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            email: userEmail,
            token: tokenFromUrl,
            type: 'recovery',
          });
          
          if (verifyError) {
            console.warn("Last attempt verifyOtp error:", verifyError);
            // Continue anyway as updateUser may still work
          }
        } catch (verifyError) {
          console.warn("Last attempt token verification failed:", verifyError);
          // Continue anyway as updateUser may still work
        }
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });

      // Clear any stored email
      localStorage.removeItem('passwordResetEmail');

      // Redirect to sign in page after a short delay
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password. The reset link may have expired.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <AuthLogo />
          </div>
          <div className="mt-6">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <AuthLogo />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Set new password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a new password for your account
            </p>
          </div>

          {!validToken && !tokenFromUrl && (
            <div className="text-center text-red-500">
              <p>Invalid or expired reset link. Please request a new password reset.</p>
              <Button
                className="mt-4 w-full"
                onClick={() => navigate('/signin')}
                style={{ backgroundColor: "rgb(69, 66, 158)" }}
              >
                Back to sign in
              </Button>
            </div>
          )}

          {(validToken || tokenFromUrl) && (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                  minLength={6}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                  minLength={6}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                style={{ backgroundColor: "rgb(69, 66, 158)" }}
              >
                {loading ? "Updating..." : "Set new password"}
              </Button>

              <div className="text-center text-sm">
                <button 
                  type="button" 
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate('/signin')}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
