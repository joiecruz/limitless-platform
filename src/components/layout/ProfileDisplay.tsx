import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDisplayProps {
  avatarUrl: string;
  initials: string;
  displayName: string;
  email: string;
}

export function ProfileDisplay({ avatarUrl, initials, displayName, email }: ProfileDisplayProps) {
  return (
    <div className="flex items-center gap-3 px-2 w-full hover:bg-gray-100 rounded-lg transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0 text-left">
        <span className="text-sm font-medium text-gray-700 truncate">
          {displayName}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {email}
        </span>
      </div>
    </div>
  );
}