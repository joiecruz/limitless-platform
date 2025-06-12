import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useRef, useState, useEffect, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useGlobalRole } from "@/hooks/useGlobalRole";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
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
import { ImageIcon, SendHorizontal, Lock } from "lucide-react";

interface MessageInputProps {
  channelName: string;
  onSendMessage: (content: string, imageUrl?: string) => void;
  activeChannel: Channel;
  editingMessage?: {id: string, content: string} | null;
  onCancelEdit?: () => void;
  onUpdateMessage?: (updatedMessage: any) => void;
}

interface User {
  username: string;
  id: string;
}

export function MessageInput({
  channelName,
  onSendMessage,
  activeChannel,
  editingMessage,
  onCancelEdit,
  onUpdateMessage
}: MessageInputProps) {
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
  const { is_superadmin, is_admin } = useGlobalRole();
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { data: workspaceRole } = useWorkspaceRole(currentWorkspace?.id || "");

  // Set message content when editing
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);

      // Stop typing indicator when editing starts
      setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Focus and position cursor
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 100);
    } else {
      setMessage("");
    }
  }, [editingMessage]);

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (editingMessage) {
      // Handle editing
      try {
        const { error } = await supabase
          .from('messages')
          .update({
            content: message.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMessage.id);

        if (error) throw error;

        // Clear editing state (removed success toast)
        if (onCancelEdit) {
          onCancelEdit();
        }
        setMessage("");
      } catch (error) {
        console.error('Error editing message:', error);
        toast({
          title: "Error",
          description: "Failed to edit message",
          variant: "destructive",
        });
      }
    } else {
      // Handle new message
      onSendMessage(message);
      setMessage("");
      setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    setMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Always maintain cursor at end when editing
    if (editingMessage) {
      setTimeout(() => {
        if (inputRef.current) {
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 0);
    } else {
      // Only handle typing indicator when not editing
      handleTyping();
    }

    // Check for @ mentions (only when not editing)
    if (!editingMessage) {
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

  // Check if user can post in this channel
  const canPost = () => {
    // If it's not a read-only channel, everyone can post
    if (!activeChannel.read_only) {
      return true;
    }

    // For read-only public channels, only superadmins and admins can post
    if (activeChannel.is_public && activeChannel.read_only) {
      return is_superadmin || is_admin;
    }

    // For read-only private channels, only workspace admins and owners can post
    if (!activeChannel.is_public && activeChannel.read_only) {
      return workspaceRole === 'admin' || workspaceRole === 'owner';
    }

    return true;
  };

  const isInputDisabled = !canPost() || isUploading;

  const handleInputFocus = () => {
    // Position cursor at end for editing
    if (editingMessage && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 200);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        ref={inputRef}
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={
          editingMessage
            ? "Edit your message..."
            : isInputDisabled && activeChannel.read_only
              ? "This channel is read-only"
              : `Message #${channelName}`
        }
        className="flex-1"
        disabled={isInputDisabled}
        onFocus={handleInputFocus}
      />
      {showMentions && !editingMessage && (
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
      {!editingMessage && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            disabled={isInputDisabled}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isInputDisabled}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
        </>
      )}
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || isInputDisabled}
        size="icon"
        className={editingMessage ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
      {editingMessage && (
        <Button
          onClick={handleCancel}
          variant="outline"
          size="icon"
        >
          ✕
        </Button>
      )}
    </div>
  );
}