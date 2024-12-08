import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  loading: boolean;
  profile: any;
  userEmail: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ProfileForm({ loading, profile, userEmail, onSubmit }: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          defaultValue={profile?.first_name || ''}
          placeholder="Enter your first name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          defaultValue={profile?.last_name || ''}
          placeholder="Enter your last name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={userEmail || ''}
          disabled
          className="bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          Email cannot be changed
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}