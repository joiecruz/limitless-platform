import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SignupStepProps } from "./types";
import { PasswordRequirements } from "./steps/PasswordRequirements";

interface SignupStep2Props extends SignupStepProps {
  onPasswordSet: (firstName: string, lastName: string, password: string) => void;
}

export function SignupStep2({ data, onBack, onPasswordSet }: SignupStep2Props) {
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [password, setPassword] = useState(data.password);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isPasswordValid = () => {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /\d/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const isFormValid = firstName.trim() !== "" && lastName.trim() !== "" && isPasswordValid();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      onPasswordSet(firstName.trim(), lastName.trim(), password);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Tell us more about you
        </h2>
        <p className="text-muted-foreground">
          Let's personalize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="mt-1"
            />
          </div>
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

        <div className="flex gap-3 pt-2">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-6"
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1"
            disabled={loading || !isFormValid}
            variant={isFormValid ? "default" : "secondary"}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
