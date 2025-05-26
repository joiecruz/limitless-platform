import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InviteSignInProps {
  onSignIn: (password: string) => void;
  email?: string;
  loading?: boolean;
}

export function InviteSignIn({ onSignIn, email, loading }: InviteSignInProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email || ""}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !password.trim()}>
          {loading ? "Signing in..." : "Sign In & Join Workspace"}
        </Button>
      </div>
    </form>
  );
}