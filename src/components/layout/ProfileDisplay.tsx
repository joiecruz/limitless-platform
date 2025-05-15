
import React, { memo } from "react";

interface ProfileDisplayProps {
  avatarUrl: string;
  initials: string;
  displayName: string;
  email: string;
}

export const ProfileDisplay = memo(function ProfileDisplay({
  avatarUrl,
  initials,
  displayName,
  email
}: ProfileDisplayProps) {
  return (
    <div className="flex items-center gap-3 px-2 py-1 rounded-lg w-full hover:bg-gray-100 transition-colors">
      <div className="relative h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 text-primary font-medium">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={displayName || email} 
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerText = initials;
            }}
          />
        ) : (
          initials
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{displayName || 'User'}</p>
        <p className="text-xs text-muted-foreground truncate">{email}</p>
      </div>
    </div>
  );
});
