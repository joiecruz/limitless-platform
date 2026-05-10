import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Info } from "lucide-react";
import { SignupStepProps } from "./types";
import { Link, useSearchParams } from "react-router-dom";

interface SignupStep1Props extends SignupStepProps {
  onEmailVerified: (email: string) => void;
}

export function SignupStep1({ data, onEmailVerified }: SignupStep1Props) {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const [email, setEmail] = useState(data.email || emailFromUrl);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [existingAccount, setExistingAccount] = useState(false);
  const { toast } = useToast();

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  const checkAccountExists = async (emailAddress: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("check-email-exists", {
        body: { email: emailAddress.toLowerCase().trim() },
      });
      if (error) return false;
      return !!data?.exists;
    } catch {
      return false;
    }
  };

  // Check if a pre-filled invite email already has an account
  useEffect(() => {
    if (emailFromUrl && /\S+@\S+\.\S+/.test(emailFromUrl)) {
      checkAccountExists(emailFromUrl).then((exists) => {
        if (exists) setExistingAccount(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFromUrl]);

  // Also check on blur when user types an email
  const handleEmailBlur = async () => {
    if (!isValidEmail) {
      setExistingAccount(false);
      return;
    }
    const exists = await checkAccountExists(email);
    setExistingAccount(exists);
  };

  const sendOtpCode = async (emailAddress: string) => {
    // Use custom edge function to send OTP via Resend
    const response = await supabase.functions.invoke('send-otp', {
      body: { email: emailAddress },
    });
    
    if (response.error) {
      throw new Error(response.error.message || 'Failed to send verification code');
    }
    
    if (response.data?.error) {
      throw new Error(response.data.error);
    }
    
    return { success: true };
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setLoading(true);
    try {
      // Pre-check existing account first to avoid sending an OTP
      const exists = await checkAccountExists(email);
      if (exists) {
        setExistingAccount(true);
        setLoading(false);
        return;
      }

      await sendOtpCode(email);

      setShowOtpInput(true);
      toast({
        title: "Verification code sent!",
        description: "Please check your email for the 6-digit code.",
      });
    } catch (error: any) {
      const message = error?.message || "";
      if (message.includes("account_exists")) {
        setExistingAccount(true);
      } else {
        toast({
          title: "Error",
          description: message || "Failed to send verification code.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit code from your email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Use custom edge function to verify OTP
      const response = await supabase.functions.invoke('verify-otp', {
        body: { email, code: verificationCode },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Verification failed');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      if (!response.data?.success) {
        throw new Error('Invalid or expired verification code');
      }

      // Set the session from the tokens returned by verify-otp
      if (response.data?.access_token && response.data?.refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        });

        if (sessionError) {
          console.error("Error setting session:", sessionError);
          throw new Error("Failed to establish session");
        }
      }

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
      await sendOtpCode(email);

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

  const handleChangeEmail = () => {
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
            Please enter the 6-digit code we sent to
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
                maxLength={6}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12 text-xl border-border" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-xl border-border" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-xl border-border" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-xl border-border" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-xl border-border" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-xl border-border" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button 
            onClick={handleVerifyCode}
            className="w-full"
            size="lg"
            disabled={loading || verificationCode.length !== 6}
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
            onChange={(e) => {
              setEmail(e.target.value);
              setExistingAccount(false);
            }}
            onBlur={handleEmailBlur}
            placeholder="you@company.com"
            className="mt-1"
          />
        </div>

        {existingAccount && (
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">You already have an account!</p>
              <p className="text-blue-700 mt-0.5">
                An account with this email already exists. Please{" "}
                <Link to={`/signin`} className="font-semibold underline hover:text-blue-900">
                  sign in instead
                </Link>.
              </p>
            </div>
          </div>
        )}

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
