import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SignupStepProps } from "./types";
import { Link } from "react-router-dom";

interface SignupStep1Props extends SignupStepProps {
  onEmailVerified: (email: string) => void;
}

export function SignupStep1({ data, onEmailVerified }: SignupStep1Props) {
  const [email, setEmail] = useState(data.email);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setLoading(true);
    try {
      // Generate a temporary secure password for initial signup
      const tempPassword = crypto.randomUUID() + "Aa1!";
      
      const { error } = await supabase.auth.signUp({
        email,
        password: tempPassword,
      });

      if (error) throw error;

      setShowOtpInput(true);
      toast({
        title: "Verification code sent!",
        description: "Please check your email for the 4-digit code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 4) {
      toast({
        title: "Invalid code",
        description: "Please enter the 4-digit code from your email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'email',
      });

      if (error) throw error;

      toast({
        title: "Email verified!",
        description: "Let's continue setting up your account.",
      });

      onEmailVerified(email);
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
      setVerificationCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: "Code sent!",
        description: "A new verification code has been sent to your email.",
      });

      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Failed to resend",
        description: error.message || "Could not send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    await supabase.auth.signOut();
    setShowOtpInput(false);
    setVerificationCode("");
    setEmail("");
  };

  if (showOtpInput) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Verify your email
          </h2>
          <p className="text-muted-foreground text-sm">
            Please enter the 4-digit code we sent to
          </p>
          <p className="text-foreground font-medium">{email}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground font-medium text-sm text-center">Confirmation code</p>
            <div className="flex justify-center">
              <InputOTP
                value={verificationCode}
                onChange={(value) => setVerificationCode(value)}
                maxLength={4}
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot index={0} className="w-14 h-14 text-xl border-border" />
                  <InputOTPSlot index={1} className="w-14 h-14 text-xl border-border" />
                  <InputOTPSlot index={2} className="w-14 h-14 text-xl border-border" />
                  <InputOTPSlot index={3} className="w-14 h-14 text-xl border-border" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button 
            onClick={handleVerifyCode}
            className="w-full"
            size="lg"
            disabled={loading || verificationCode.length !== 4}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>

          <div className="text-center space-x-1 text-sm">
            <button 
              onClick={handleResendCode}
              disabled={resendLoading || resendCooldown > 0}
              className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 
                ? `Resend code (${resendCooldown}s)` 
                : resendLoading 
                  ? "Sending..." 
                  : "Resend code"
              }
            </button>
            <span className="text-muted-foreground">or</span>
            <button 
              onClick={handleChangeEmail}
              className="text-primary hover:underline font-medium"
            >
              Use different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="text-muted-foreground">
          Join Limitless Lab and start your innovation journey
        </p>
      </div>

      <div className="space-y-4">
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

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !isValidEmail}
          variant={isValidEmail ? "default" : "secondary"}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            "Continue"
          )}
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
          <Link to="/signin" className="text-primary font-semibold hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
