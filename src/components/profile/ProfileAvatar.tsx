import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  getInitials: () => string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({ avatarUrl, getInitials, onAvatarChange }: ProfileAvatarProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      
      <div>
        <Label htmlFor="avatar" className="cursor-pointer inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
          Change Avatar
        </Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
          className="hidden"
        />
      </div>
    </div>
  );
}