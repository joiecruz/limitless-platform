import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PasswordRequirements } from "@/components/signup/steps/PasswordRequirements";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });

      // Navigate to dashboard (Supabase will handle the email verification)
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <img 
              src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
              alt="Limitless Lab"
              className="h-12 w-auto mx-auto mb-8"
            />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
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
                placeholder="you@company.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <PasswordRequirements password={password} />
            </div>
            <Button 
              type="button" 
              className="w-full" 
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Quotes */}
      <div className="hidden lg:flex lg:flex-1 bg-primary-50">
        <div className="w-full flex items-center justify-center p-12">
          <div className="max-w-lg">
            <blockquote className="text-xl font-medium text-gray-900">
              "Limitless Lab has transformed the way we approach innovation. The platform's intuitive design and comprehensive resources have made it easier than ever to bring our ideas to life."
            </blockquote>
            <div className="mt-4">
              <p className="font-semibold">Sarah Johnson</p>
              <p className="text-sm text-gray-600">Innovation Lead, TechCorp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}