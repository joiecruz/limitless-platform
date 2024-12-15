import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VerifyEmailHeader } from "@/components/verify-email/VerifyEmailHeader";
import { VerifyEmailIcon } from "@/components/verify-email/VerifyEmailIcon";
import { useWorkspaceJoin } from "@/components/verify-email/useWorkspaceJoin";

export default function VerifyEmail() {
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const { joinWorkspace, isJoining } = useWorkspaceJoin();

  useEffect(() => {
    const storedEmail = localStorage.getItem('verificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, session });
      
      if (event === 'SIGNED_IN' && session?.user) {
        await joinWorkspace(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
      });
    } catch (error: any) {
      console.error("Error resending verification email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <VerifyEmailHeader />

        <Card className="w-full">
          <CardContent className="pt-6 text-center">
            <div className="mb-6">
              <VerifyEmailIcon />
              <h2 className="text-2xl font-semibold mb-2">Verify your email to continue</h2>
              <p className="text-gray-600 mb-1">
                We've sent a verification email to{" "}
                <span className="font-medium text-gray-900">{email || "your email address"}</span>
              </p>
              <p className="text-gray-600">
                Click the link in the email to complete your account setup and join your workspace.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                If you don't receive the email within 5 minutes, please check your spam folder or click below to resend.
              </p>
              <Button 
                className="w-full" 
                onClick={handleResendEmail}
                disabled={isResending || !email || isJoining}
              >
                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}