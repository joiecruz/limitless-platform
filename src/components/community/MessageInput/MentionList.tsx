import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface MentionListProps {
  mentionSearch: string;
  setMentionSearch: (search: string) => void;
  users: { id: string; first_name: string | null; last_name: string | null }[];
  onSelect: (displayName: string) => void;
  currentUserId: string;
}

export function MentionList({ mentionSearch, setMentionSearch, users, onSelect, currentUserId }: MentionListProps) {
  const getDisplayName = (user: { first_name: string | null; last_name: string | null }) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous';
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
              getDisplayName(user).toLowerCase().includes(mentionSearch.toLowerCase())
            )
            .map(user => (
              <CommandItem
                key={user.id}
                onSelect={() => onSelect(getDisplayName(user))}
              >
                {getDisplayName(user)}
              </CommandItem>
            ))
          }
        </CommandGroup>
      </CommandList>
    </Command>
  );
}