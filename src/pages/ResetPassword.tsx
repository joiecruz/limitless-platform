
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLogo } from "@/components/auth/AuthLogo";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [validToken, setValidToken] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Parse both hash and query parameters to handle different Supabase redirect scenarios
    const parseParams = () => {
      console.log('Checking for reset parameters in URL');
      
      // Try to get parameters from hash fragment first
      const hashParams = location.hash && location.hash.length > 1 
        ? new URLSearchParams(location.hash.substring(1)) 
        : null;
      
      // Get parameter from search query as fallback
      const queryParams = new URLSearchParams(location.search);
      
      // Log all parameters for debugging
      console.log('Hash parameters:', hashParams ? Object.fromEntries(hashParams.entries()) : 'None');
      console.log('Query parameters:', Object.fromEntries(queryParams.entries()));
      
      // Look for type and token in hash parameters first
      if (hashParams) {
        const type = hashParams.get('type');
        const token = hashParams.get('access_token');
        
        if (token && type === 'recovery') {
          console.log('Found valid recovery token in hash params');
          setValidToken(true);
          setAccessToken(token);
          return;
        }
      }
      
      // Check query parameters if hash parameters don't have what we need
      const type = queryParams.get('type');
      const token = queryParams.get('access_token') || queryParams.get('token'); // Try both access_token and token
      
      if (token && type === 'recovery') {
        console.log('Found valid recovery token in query params');
        setValidToken(true);
        setAccessToken(token);
        return;
      }
      
      // Finally check for a JWT in the hash without params (another Supabase format)
      if (location.hash && location.hash.length > 20 && !location.hash.includes('=')) {
        // This might be a JWT directly in the hash
        const possibleToken = location.hash.substring(1);
        console.log('Found possible token in hash:', possibleToken.substring(0, 15) + '...');
        setValidToken(true);
        setAccessToken(possibleToken);
        return;
      }
      
      // If we get here, no valid parameters were found
      console.log('No valid reset parameters found');
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      
      // Wait a moment before redirecting to allow toast to display
      setTimeout(() => navigate('/signin'), 2000);
    };

    // Check for parameters on mount
    parseParams();
  }, [location, navigate, toast]);

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
    
    if (!validatePassword() || !validToken || !accessToken) {
      return;
    }
    
    setLoading(true);

    try {
      console.log('Attempting to update password with token...');
      
      // Fix: Use the correct updateUser API
      const { error } = await supabase.auth.updateUser(
        { password },
        { emailRedirectTo: window.location.origin } // Use correct option
      );

      if (error) {
        console.error("Password update error:", error);
        throw error;
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });

      // Redirect to sign in page
      setTimeout(() => navigate('/signin'), 1500);
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
              <div>
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  minLength={6}
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                  minLength={6}
                />
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
