import { Button } from "@/components/ui/button";
import { WebNavProfileMenu } from "@/components/layout/WebNavProfileMenu";

interface AuthButtonsProps {
  session: any;
  profile: any;
  getInitials: () => string;
  getDisplayName: () => string;
  getDefaultAvatar: () => string;
  handleAuthClick: (path: string) => void;
}

export function AuthButtons({ 
  session, 
  profile, 
  getInitials, 
  getDisplayName, 
  getDefaultAvatar,
  handleAuthClick 
}: AuthButtonsProps) {
  return (
    <div className="flex items-center space-x-4">
      {session ? (
        <WebNavProfileMenu
          avatarUrl={profile?.avatar_url || getDefaultAvatar()}
          initials={getInitials()}
          displayName={getDisplayName()}
        />
      ) : (
        <>
          <Button 
            variant="ghost"
            onClick={() => handleAuthClick('/signin')}
          >
            Log in
          </Button>
          <Button 
            className="bg-[#393CA0] hover:bg-[#393CA0]/90"
            onClick={() => handleAuthClick('/signup')}
          >
            Sign up
          </Button>
        </>
      )}
    </div>
  );
}