import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface User {
  id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

interface MentionListProps {
  mentionSearch: string;
  setMentionSearch: (search: string) => void;
  users: User[];
  onSelect: (displayName: string) => void;
  currentUserId: string;
  selectedIndex?: number;
}

export function MentionList({ mentionSearch, setMentionSearch, users, onSelect, currentUserId, selectedIndex = 0 }: MentionListProps) {
  const getDisplayName = (user: User) => {
    if (user.username) return user.username;
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous';
  };

  const getFullName = (user: User) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  };

  const filterUser = (user: User, searchLower: string) => {
    const username = user.username?.toLowerCase() || '';
    const fullName = getFullName(user).toLowerCase();
    const firstName = user.first_name?.toLowerCase() || '';
    const lastName = user.last_name?.toLowerCase() || '';

    return username.includes(searchLower) ||
           fullName.includes(searchLower) ||
           firstName.includes(searchLower) ||
           lastName.includes(searchLower);
  };

  return (
    <Command>
      <CommandInput placeholder="Search users..." value={mentionSearch} onValueChange={setMentionSearch} />
      <CommandList>
        <CommandEmpty>No users found</CommandEmpty>
        <CommandGroup>
          {users
            .filter(user =>
              user.id !== currentUserId && // Prevent self-mentions
              filterUser(user, mentionSearch.toLowerCase())
            )
            .map((user, index) => {
              const displayName = getDisplayName(user);
              const fullName = getFullName(user);

              return (
                <CommandItem
                  key={user.id}
                  onSelect={() => onSelect(displayName)}
                  className={index === selectedIndex ? "bg-accent" : ""}
                >
                  <div className="flex flex-col">
                    <span>{displayName}</span>
                    {user.username && fullName && user.username !== fullName && (
                      <span className="text-xs text-gray-500">
                        {fullName}
                      </span>
                    )}
                  </div>
                </CommandItem>
              );
            })
          }
        </CommandGroup>
      </CommandList>
    </Command>
  );
}