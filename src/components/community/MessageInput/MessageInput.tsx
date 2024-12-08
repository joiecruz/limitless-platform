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
  first_name: string | null;
  last_name: string | null;
}

export function MessageInput({ channelName, onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .not("id", "is", null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    const lastAtSymbol = value.lastIndexOf("@");
    if (lastAtSymbol !== -1 && lastAtSymbol === value.length - 1) {
      setShowMentions(true);
      setMentionSearch("");
    } else if (lastAtSymbol !== -1) {
      const searchText = value.slice(lastAtSymbol + 1);
      setMentionSearch(searchText);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (displayName: string) => {
    const lastAtSymbol = newMessage.lastIndexOf("@");
    const newValue = newMessage.slice(0, lastAtSymbol) + `@${displayName} `;
    setNewMessage(newValue);
    setShowMentions(false);
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
        placeholder={`Message ${channelName || ''}`}
        className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {showMentions && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
          <MentionList
            mentionSearch={mentionSearch}
            setMentionSearch={setMentionSearch}
            users={users}
            onSelect={handleMentionSelect}
            currentUserId={currentUserId}
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