import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BatchEmailInputProps {
  onSubmit: (emails: string[]) => void;
  isLoading?: boolean;
}

export function BatchEmailInput({ onSubmit, isLoading }: BatchEmailInputProps) {
  const [emailInput, setEmailInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = emailInput
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
    
    if (emails.length > 0) {
      onSubmit(emails);
      setEmailInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Enter email addresses (separated by commas or new lines)
        </label>
        <textarea
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="john@example.com, jane@example.com"
        />
      </div>
      <Button type="submit" disabled={isLoading || !emailInput.trim()}>
        {isLoading ? "Sending Invites..." : "Send Invites"}
      </Button>
    </form>
  );
}