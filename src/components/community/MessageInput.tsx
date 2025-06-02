import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { Channel } from "@/types/community";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ImageIcon, SendHorizontal } from "lucide-react";

interface MessageInputProps {
  channelName: string;
  onSendMessage: (content: string, imageUrl?: string) => void;
  activeChannel: Channel;
}

interface User {
  username: string;
  id: string;
}

export function MessageInput({ channelName, onSendMessage, activeChannel }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { setTyping } = useTypingIndicator(activeChannel);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, id")
        .not("username", "is", null);

      if (!error && data) {
        setUsers(data as User[]);
      }
    };

    fetchUsers();
  }, []);

  const handleTyping = () => {
    console.log("[MessageInput] User is typing");
    setTyping(true);

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      console.log("[MessageInput] User stopped typing");
      setTyping(false);
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    handleTyping();

    // Check for @ mentions
    const lastAtSymbol = value.lastIndexOf("@");
    if (lastAtSymbol !== -1 && lastAtSymbol === value.length - 1) {
      const rect = e.target.getBoundingClientRect();
      setMentionPosition({
        top: rect.bottom,
        left: rect.left,
      });
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

  const handleMentionSelect = (username: string) => {
    const lastAtSymbol = message.lastIndexOf("@");
    const newValue = message.slice(0, lastAtSymbol) + `@${username} `;
    setMessage(newValue);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `message-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("message-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("message-images")
        .getPublicUrl(filePath);

      onSendMessage(message, publicUrl);
      setMessage("");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Input
        ref={inputRef}
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={`Message #${channelName}`}
        className="flex-1"
        disabled={isUploading}
      />
      {showMentions && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
          <Command>
            <CommandInput placeholder="Search users..." value={mentionSearch} onValueChange={setMentionSearch} />
            <CommandList>
              <CommandEmpty>No users found</CommandEmpty>
              <CommandGroup>
                {users
                  .filter(user =>
                    user.username?.toLowerCase().includes(mentionSearch.toLowerCase())
                  )
                  .map(user => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleMentionSelect(user.username)}
                    >
                      {user.username}
                    </CommandItem>
                  ))
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <ImageIcon className="h-5 w-5" />
      </Button>
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || isUploading}
        size="icon"
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
}