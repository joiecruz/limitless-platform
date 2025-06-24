import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { LoadingPage } from "@/components/common/LoadingPage";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [validToken, setValidToken] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for token in both hash and query parameters
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);

    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token') || queryParams.get('token');

    console.log('Reset password page loaded', {
      hashType: type,
      hasHashToken: !!hashParams.get('access_token'),
      hasQueryToken: !!queryParams.get('token')
    });

    if (!accessToken) {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      setIsNavigating(true);
      setTimeout(() => navigate('/signin'), 2000);
      return;
    }

    // If we have a token in query params, we need to exchange it
    if (queryParams.get('token')) {
      // The App.tsx already handles setting the session from the token
      setValidToken(true);
      return;
    }

    // For hash-based tokens, verify it's a recovery type
    if (type !== 'recovery') {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      setIsNavigating(true);
      setTimeout(() => navigate('/signin'), 2000);
      return;
    }

    setValidToken(true);
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

      // Sign out the user to clear the session before navigating
      await supabase.auth.signOut();

      // Show loading and navigate after 2 seconds
      setIsNavigating(true);
      setTimeout(() => navigate('/signin'), 2000);
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

  if (isNavigating) {
    return <LoadingPage />;
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
                onClick={() => {
                  setIsNavigating(true);
                  setTimeout(() => navigate('/signin'), 2000);
                }}
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