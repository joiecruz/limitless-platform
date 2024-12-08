import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NameFields({ firstName, lastName, handleInputChange }: NameFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={handleInputChange}
          required
          className="rounded-[5px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={handleInputChange}
          required
          className="rounded-[5px]"
        />
      </div>
    </div>
  );
}