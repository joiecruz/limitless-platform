
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [validToken, setValidToken] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Function to check for and validate token
    const checkResetToken = async () => {
      try {
        setVerifying(true);
        console.log("Checking for reset token...");
        
        // Check for token in both hash and query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // First, check hash (Supabase default method)
        let tokenType = hashParams.get('type');
        let accessToken = hashParams.get('access_token');
        
        // If not found in hash, check query params (our custom redirect handling)
        if (!accessToken) {
          accessToken = queryParams.get('token');
          tokenType = queryParams.get('type') || 'recovery';
        }
        
        console.log("Token validation:", {
          hasToken: !!accessToken,
          tokenType,
          fromHash: !!hashParams.get('access_token'),
          fromQuery: !!queryParams.get('token')
        });

        // No token found in either location
        if (!accessToken) {
          console.error("No reset token found in URL");
          toast({
            title: "Invalid Reset Link",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive",
          });
          navigate('/signin');
          return;
        }
        
        // For hash-based tokens, verify it's a recovery type
        if (tokenType && tokenType !== 'recovery') {
          console.error("Invalid token type:", tokenType);
          toast({
            title: "Invalid Reset Link",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive",
          });
          navigate('/signin');
          return;
        }

        // If we have the token, verify the session is valid
        if (accessToken) {
          try {
            // Get current session
            const { data: currentSession } = await supabase.auth.getSession();
            
            // If there's no session, try to set it from the token
            if (!currentSession.session) {
              if (hashParams.get('refresh_token')) {
                // If we have both access and refresh tokens (from hash)
                const { error: sessionError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: hashParams.get('refresh_token') || '',
                });
                
                if (sessionError) {
                  console.error("Error setting session from hash tokens:", sessionError);
                  throw sessionError;
                }
              } else {
                // For recovery tokens from email, we only need verify the token
                // The session will be created when the password is reset
              }
            }
            
            setValidToken(true);
          } catch (error) {
            console.error("Error validating reset token:", error);
            toast({
              title: "Invalid Reset Link",
              description: "This password reset link is invalid or has expired.",
              variant: "destructive",
            });
            navigate('/signin');
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
        toast({
          title: "Error",
          description: "There was a problem processing your reset link.",
          variant: "destructive",
        });
        navigate('/signin');
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

    if (!validatePassword() || !validToken) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });

      // Redirect to sign in page after a short delay
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
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

          {!validToken ? (
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
          ) : (
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
