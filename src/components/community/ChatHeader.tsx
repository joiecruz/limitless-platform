import { Hash, Users } from "lucide-react";
import { Channel } from "@/types/community";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  channel: Channel;
}

export function ChatHeader({ channel }: ChatHeaderProps) {
  const onlineUsers = useOnlineUsers(channel);
  const { typingUsers } = useTypingIndicator(channel);

  const getDisplayName = (user: typeof onlineUsers[0]) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username || "Anonymous";
  };

  const getInitials = (user: typeof onlineUsers[0]) => {
    if (user.first_name || user.last_name) {
      return `${(user.first_name?.[0] || '').toUpperCase()}${(user.last_name?.[0] || '').toUpperCase()}`;
    }
    return (user.username?.[0] || '?').toUpperCase();
  };

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      return `${getDisplayName(typingUsers[0])} is typing...`;
    }
    if (typingUsers.length === 2) {
      return `${getDisplayName(typingUsers[0])} and ${getDisplayName(typingUsers[1])} are typing...`;
    }
    return `${typingUsers.length} people are typing...`;
  };

  const typingText = getTypingText();

  return (
    <div className="border-b px-6 py-4">
      <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Hash className="h-5 w-5 text-gray-400 mr-2" />
        <h1 className="text-xl font-semibold text-gray-900">{channel.name}</h1>
      </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-green-50">
              <div className="relative">
                <Users className="h-4 w-4 text-green-600" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <span className="text-sm text-green-600 font-medium">{onlineUsers.length} online</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="end">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Online Users</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                {onlineUsers.length} online
              </Badge>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} alt={getDisplayName(user)} />
                      <AvatarFallback>{getInitials(user)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName(user)}</p>
                    <p className="text-xs text-green-600">Online</p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-2 mt-1">
      {channel.description && (
          <p className="text-sm text-gray-500">{channel.description}</p>
      )}
        {typingText && (
          <p className="text-sm text-green-600 animate-pulse flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
            {typingText}
          </p>
        )}
      </div>
    </div>
  );
}