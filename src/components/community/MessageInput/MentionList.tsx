import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface MentionListProps {
  mentionSearch: string;
  setMentionSearch: (search: string) => void;
  users: { username: string; id: string }[];
  onSelect: (username: string) => void;
  currentUserId: string;
}

export function MentionList({ mentionSearch, setMentionSearch, users, onSelect, currentUserId }: MentionListProps) {
  return (
    <Command>
      <CommandInput placeholder="Search users..." value={mentionSearch} onValueChange={setMentionSearch} />
      <CommandList>
        <CommandEmpty>No users found</CommandEmpty>
        <CommandGroup>
          {users
            .filter(user => 
              user.username?.toLowerCase().includes(mentionSearch.toLowerCase()) &&
              user.id !== currentUserId // Prevent self-mentions
            )
            .map(user => (
              <CommandItem
                key={user.id}
                onSelect={() => onSelect(user.username)}
              >
                {user.username}
              </CommandItem>
            ))
          }
        </CommandGroup>
      </CommandList>
    </Command>
  );
}