
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PasswordRequirements } from "@/components/signup/steps/PasswordRequirements";
import { QuotesCarousel } from "@/components/signup/QuotesCarousel";
import { AuthLogo } from "@/components/auth/AuthLogo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Query to check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const handleLogoClick = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const addUserToSysteme = async (userId: string) => {
    try {
      console.log("[SignUp] Adding user to Systeme.io:", userId);
      const { data, error } = await supabase.functions.invoke('handle-systeme-signup', {
        body: { user_id: userId }
      });
      
      if (error) {
        console.error('[SignUp] Error adding user to Systeme.io:', error);
        return false;
      }
      
      if (data && !data.success) {
        console.warn('[SignUp] Systeme.io integration responded with non-success:', data);
        return false;
      }
      
      console.log('[SignUp] Successfully added user to Systeme.io:', data);
      return true;
    } catch (e) {
      console.error('[SignUp] Exception adding user to Systeme.io:', e);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Try to add the user to Systeme.io right after signup
      // But don't block the signup flow if it fails
      if (data?.user) {
        // Call the function but don't await or depend on its result
        addUserToSysteme(data.user.id).catch(err => {
          console.error('[SignUp] Background Systeme.io error:', err);
          // Don't show an error toast as this is non-critical
        });
      }

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });

      // After signing up, redirect to dashboard with onboarding flag
      navigate("/dashboard", { 
        state: { showOnboarding: true },
        replace: true 
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return email.trim() !== "" && 
           /\S+@\S+\.\S+/.test(email) && 
           password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /\d/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div onClick={handleLogoClick} className="cursor-pointer">
              <AuthLogo />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join Limitless Lab and start your innovation journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
              <PasswordRequirements password={password} />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !isFormValid()}
              variant={isFormValid() ? "default" : "secondary"}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </Button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Quotes */}
      <div className="hidden lg:flex lg:flex-1 bg-primary-50">
        <QuotesCarousel />
      </div>
    </div>
  );
}
