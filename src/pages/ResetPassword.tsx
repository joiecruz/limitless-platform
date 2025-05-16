
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { Eye, EyeOff } from "lucide-react";
import { extractTokenFromUrl, extractEmailFromUrl } from '@/hooks/useEmailConfirmation';
import { usePasswordReset } from '@/hooks/usePasswordReset';

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
  const { updatePassword } = usePasswordReset();

  useEffect(() => {
    // Function to check for and validate token
    const checkResetToken = async () => {
      try {
        setVerifying(true);
        console.log("Checking for reset token...");
        
        // Extract token from URL using our improved utility
        const accessToken = extractTokenFromUrl();
        setTokenFromUrl(accessToken);
        
        // Extract email from URL or localStorage
        const email = extractEmailFromUrl();
        if (email) {
          console.log("Found email for verification:", email);
          setUserEmail(email);
        }
        
        // Log what we found for debugging
        console.log("Token validation:", {
          hasToken: !!accessToken,
          email,
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash
        });

        // No token found in any location
        if (!accessToken) {
          console.error("No reset token found in URL");
          toast({
            title: "Invalid Reset Link",
            description: "This password reset link is invalid or has expired. Please request a new one.",
            variant: "destructive",
          });
          setValidToken(false);
          return;
        }

        // If we found a token, we'll allow the user to reset their password
        // The actual verification will happen when they submit the form
        setValidToken(true);
        
      } catch (error: any) {
        console.error("Token verification error:", error);
        toast({
          title: "Error",
          description: "There was a problem validating your reset link. You can still attempt to reset your password.",
          variant: "destructive",
        });
        // We'll still let them try if the token is present
        setValidToken(!!tokenFromUrl);
      } finally {
        setVerifying(false);
      }
    };

    checkResetToken();
  }, [navigate, toast, tokenFromUrl]);

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

    // Use the updatePassword function from our hook
    const success = await updatePassword(password);
    
    if (!success) {
      setLoading(false);
    }
    // Success case is handled inside the hook
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
              {userEmail && (
                <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded text-center">
                  Resetting password for: <span className="font-medium">{userEmail}</span>
                </div>
              )}
              
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
