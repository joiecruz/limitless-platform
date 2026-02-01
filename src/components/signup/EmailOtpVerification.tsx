import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface EmailOtpVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export const EmailOtpVerification = ({ 
  email, 
  onVerificationSuccess,
  onBack 
}: EmailOtpVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  const handleVerification = async () => {
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
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'email',
      });

      if (error) throw error;

      toast({
        title: "Email verified!",
        description: "Your account has been verified successfully.",
      });

      onVerificationSuccess();
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

      // Start 60-second cooldown
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Verify your email</h2>
        <img 
          src="/lovable-uploads/0dd5367c-3e22-4eff-a5b1-2604397dfba8.png" 
          alt="Verification" 
          className="mx-auto w-32 h-32 my-6"
        />
        <p className="text-xl font-medium text-foreground">We just emailed you</p>
        <p className="text-muted-foreground text-sm mt-2">
          Please enter the 6-digit code we sent to
        </p>
        <p className="text-foreground font-medium">{email}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-muted-foreground font-medium text-sm">Confirmation code</p>
          <InputOTP
            value={verificationCode}
            onChange={(value) => setVerificationCode(value)}
            maxLength={6}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2 flex justify-center">
                {slots.map((slot, idx) => (
                  <InputOTPSlot 
                    key={idx} 
                    {...slot} 
                    index={idx} 
                    className="w-12 h-12 text-lg border-border" 
                  />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>

        <Button 
          onClick={handleVerification}
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
            "Verify"
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
            onClick={handleLogout}
            className="text-primary hover:underline font-medium"
          >
            Use different email
          </button>
        </div>
      </div>
    </div>
  );
};
