import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MentionList } from "./MentionList";
import { FileUpload } from "./FileUpload";

interface MessageInputProps {
  channelName: string;
  onSendMessage: (content: string, imageUrl?: string) => void;
}

interface User {
  id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

export function MessageInput({ channelName, onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name");

      if (!error && data) {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentions) {
      const filteredUsers = users.filter(user => {
        const searchLower = mentionSearch.toLowerCase();
        const username = user.username?.toLowerCase() || '';
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim().toLowerCase();
        const firstName = user.first_name?.toLowerCase() || '';
        const lastName = user.last_name?.toLowerCase() || '';

        return user.id !== currentUserId && (
          username.includes(searchLower) ||
          fullName.includes(searchLower) ||
          firstName.includes(searchLower) ||
          lastName.includes(searchLower)
        );
      });

      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredUsers[selectedMentionIndex]) {
          const user = filteredUsers[selectedMentionIndex];
          const displayName = user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous';
          handleMentionSelect(displayName);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex(prev =>
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex(prev =>
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
        return;
      }

      if (e.key === "Escape") {
        setShowMentions(false);
        setSelectedMentionIndex(0);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    const lastAtSymbol = value.lastIndexOf("@");
    if (lastAtSymbol !== -1) {
      const textAfterAt = value.slice(lastAtSymbol + 1);

      // Only show mentions if:
      // 1. @ is at the very end (just typed), OR
      // 2. @ is followed by text that doesn't contain a space (incomplete mention)
      if (lastAtSymbol === value.length - 1) {
        // Just typed @
        setShowMentions(true);
        setMentionSearch("");
        setSelectedMentionIndex(0);
      } else if (!textAfterAt.includes(" ")) {
        // @ followed by text without space (incomplete mention)
        setMentionSearch(textAfterAt);
        setShowMentions(true);
        setSelectedMentionIndex(0);
      } else {
        // @ followed by text with space (completed mention)
        setShowMentions(false);
        setSelectedMentionIndex(0);
      }
    } else {
      setShowMentions(false);
      setSelectedMentionIndex(0);
    }
  };

  const handleMentionSelect = (displayName: string) => {
    const lastAtSymbol = newMessage.lastIndexOf("@");
    const newValue = newMessage.slice(0, lastAtSymbol) + `@${displayName} `;
    setNewMessage(newValue);
    setShowMentions(false);
    setSelectedMentionIndex(0);
    inputRef.current?.focus();
  };

  const handleFileUploadComplete = (publicUrl: string) => {
    onSendMessage("", publicUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 relative">
      <input
        ref={inputRef}
        type="text"
        value={newMessage}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={`Message ${channelName || ''}`}
        className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {showMentions && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <MentionList
            mentionSearch={mentionSearch}
            setMentionSearch={setMentionSearch}
            users={users}
            onSelect={handleMentionSelect}
            currentUserId={currentUserId}
            selectedIndex={selectedMentionIndex}
          />
        </div>
      )}
      <FileUpload onUploadComplete={handleFileUploadComplete} />
      <Button type="submit" disabled={!newMessage.trim()}>
        Send
      </Button>
    </form>
  );
}