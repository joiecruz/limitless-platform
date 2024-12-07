import { NavigationLinks } from "./NavigationLinks";
import { UserProfile } from "./UserProfile";

export function Navigation() {
  return (
    <div className="flex flex-col h-full">
      <NavigationLinks />
      <UserProfile />
    </div>
  );
}