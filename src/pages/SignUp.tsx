import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PasswordRequirements } from "@/components/signup/steps/PasswordRequirements";
import { QuotesCarousel } from "@/components/signup/QuotesCarousel";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { EmailOtpVerification } from "@/components/signup/EmailOtpVerification";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Store the email and show OTP verification step
      setPendingEmail(email);
      setShowOtpVerification(true);
      
      toast({
        title: "Verification code sent!",
        description: "Please check your email for the 6-digit code.",
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

  const handleVerificationSuccess = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleBackToSignup = () => {
    setShowOtpVerification(false);
    setPendingEmail("");
    setEmail("");
    setPassword("");
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
      {/* Left Side - Register Form or OTP Verification */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div onClick={handleLogoClick} className="cursor-pointer">
              <AuthLogo />
            </div>
          </div>

          {showOtpVerification ? (
            <EmailOtpVerification 
              email={pendingEmail}
              onVerificationSuccess={handleVerificationSuccess}
              onBack={handleBackToSignup}
            />
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
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
                <p className="text-center text-xs text-muted-foreground">
                  By continuing, you acknowledge that you understand and agree to the{" "}
                  <Link to="/terms-of-service" className="underline hover:text-primary">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="underline hover:text-primary">
                    Privacy Policy
                  </Link>
                </p>
                <p className="text-center text-sm text-muted-foreground">
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
            </>
          )}
        </div>
      </div>

      {/* Right Side - Quotes */}
      <div className="hidden lg:flex lg:flex-1 bg-primary/5">
        <QuotesCarousel />
      </div>
    </div>
  );
}
