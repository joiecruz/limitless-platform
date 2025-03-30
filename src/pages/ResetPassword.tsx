
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [hashParams, setHashParams] = useState<URLSearchParams | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a hash token when the component mounts
    const hash = window.location.hash;
    console.log('Reset password page loaded with hash:', hash);
    
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      setHashParams(params);
      
      const type = params.get('type');
      const accessToken = params.get('access_token');
      
      console.log('Reset password parameters:', { type, accessToken: !!accessToken });
      
      if (!accessToken || type !== 'recovery') {
        toast({
          title: "Invalid Reset Link",
          description: "This password reset link is invalid or has expired.",
          variant: "destructive",
        });
        navigate('/signin');
        return;
      }
      
      setValidToken(true);
    } else {
      console.log('No hash parameters found');
      toast({
        title: "Missing Reset Link Parameters",
        description: "The password reset link appears to be incomplete.",
        variant: "destructive",
      });
      navigate('/signin');
    }
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
    
    if (!validatePassword() || !validToken || !hashParams) {
      return;
    }
    
    setLoading(true);

    try {
      console.log('Attempting to update password...');
      
      // Get the access token from the URL
      const accessToken = hashParams.get('access_token');
      console.log('Using access token for password reset');
      
      // Use updateUser to set the new password with the access token directly
      const { error } = await supabase.auth.updateUser(
        { password },
        { accessToken }
      );

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });

      // Redirect to sign in page
      navigate('/signin');
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
