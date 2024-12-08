import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get invitation details from location state
  const isInvited = location.state?.isInvited;
  const invitedEmail = location.state?.email;
  const workspaceId = location.state?.workspaceId;
  const workspaceRole = location.state?.role;

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        // If this is an invited user
        if (isInvited) {
          // Add user to workspace
          const { error: memberError } = await supabase
            .from("workspace_members")
            .insert({
              workspace_id: workspaceId,
              user_id: user.id,
              role: workspaceRole
            });

          if (memberError && memberError.code !== '23505') { // Ignore if already a member
            throw memberError;
          }

          toast({
            title: "Welcome!",
            description: "You have successfully joined the workspace.",
          });
        }

        // Check if user needs to complete onboarding
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (!profile?.first_name || !profile?.last_name) {
          setShowOnboarding(true);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        <form onSubmit={handleSignIn} className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
      
      {showOnboarding && (
        <OnboardingModal
          open={true}
          onOpenChange={(open) => {
            setShowOnboarding(open);
            if (!open) navigate("/dashboard");
          }}
        />
      )}
    </>
  );
}
