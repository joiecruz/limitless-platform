
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePassword } = usePasswordReset();

  useEffect(() => {
    // Listen for password recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery event detected");
        setShowResetForm(true);
        
        // If we have a session with user email, store it
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    await updatePassword(password);
    setLoading(false);
  };

  const handleRequestNewLink = () => {
    setShowForgotPasswordDialog(true);
  };

  // If we're not in a password recovery state, show guidance
  if (!showResetForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <AuthLogo />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Reset link required
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please use the reset link from your email to access this page.
              </p>
            </div>

            <div className="text-center">
              <Button
                className="w-full mb-3"
                onClick={handleRequestNewLink}
                style={{ backgroundColor: "rgb(69, 66, 158)" }}
              >
                Request reset link
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate('/signin')}
              >
                Back to sign in
              </Button>
            </div>
          </div>
        </div>

        {/* Dialog for requesting a new password reset */}
        <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Request a new password reset link.
              </DialogDescription>
            </DialogHeader>
            <ForgotPasswordForm 
              onCancel={() => setShowForgotPasswordDialog(false)} 
              initialEmail={userEmail || ""}
            />
          </DialogContent>
        </Dialog>
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
        </div>
      </div>

      {/* Dialog for requesting a new password reset */}
      <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Request a new password reset link.
            </DialogDescription>
          </DialogHeader>
          <ForgotPasswordForm 
            onCancel={() => setShowForgotPasswordDialog(false)} 
            initialEmail={userEmail || ""}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
