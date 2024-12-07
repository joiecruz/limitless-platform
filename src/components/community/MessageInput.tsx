import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MessageInputProps {
  channelName: string;
  onSendMessage: (content: string, imageUrl?: string) => void;
}

interface User {
  username: string;
  id: string;
}

export function MessageInput({ channelName, onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    const lastAtSymbol = newMessage.lastIndexOf("@");
    const newValue = newMessage.slice(0, lastAtSymbol) + `@${username} `;
    setNewMessage(newValue);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);

      onSendMessage("", publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Image className="h-5 w-5" />
      </Button>
      <Button type="submit" disabled={!newMessage.trim() || isUploading}>
        Send
      </Button>
    </form>
  );
}