import { Hash, Users, Menu, Eye } from "lucide-react";
import { Channel } from "@/types/community";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChannelSettings } from "./ChannelSettings";
import { useContext } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  channel: Channel;
  onChannelUpdate?: (updatedChannel: Channel) => void;
  onChannelDelete?: () => void;
  onOpenChannels?: () => void;
}

export function ChatHeader({ channel, onChannelUpdate, onChannelDelete, onOpenChannels }: ChatHeaderProps) {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { onlineUsers, offlineUsers, allUsers } = useOnlineUsers(currentWorkspace?.id || null);
  const { typingUsers } = useTypingIndicator(channel);
  const isMobile = useIsMobile();

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

  const getTypingDisplayName = (user: typeof typingUsers[0]) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username || "Anonymous";
  };

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      return `${getTypingDisplayName(typingUsers[0])} is typing...`;
    }
    if (typingUsers.length === 2) {
      return `${getTypingDisplayName(typingUsers[0])} and ${getTypingDisplayName(typingUsers[1])} are typing...`;
    }
    return `${typingUsers.length} people are typing...`;
  };

  const typingText = getTypingText();

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && onOpenChannels && (
            <Button variant="ghost" size="sm" onClick={onOpenChannels} className="mr-2">
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <Hash className="h-5 w-5 text-gray-500" />
          <h1 className="text-xl font-semibold text-gray-900">{channel.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          {channel.read_only && (
            <div className="flex items-center gap-1 text-gray-500" title="Read-only channel">
              <Eye className="h-4 w-4" />
            </div>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {onlineUsers.length > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-1.5 py-0.5">
                    {onlineUsers.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Workspace Members</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                      {onlineUsers.length} online
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {/* Online Users Section */}
                {onlineUsers.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Online ({onlineUsers.length})</span>
                    </div>
                    <div className="space-y-2">
                      {onlineUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="relative">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar_url || undefined} alt={getDisplayName(user)} />
                              <AvatarFallback className="text-xs">{getInitials(user)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName(user)}</p>
                            <p className="text-xs text-green-600">Online</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Separator */}
                {onlineUsers.length > 0 && offlineUsers.length > 0 && (
                  <Separator />
                )}

                {/* Offline Users Section */}
                {offlineUsers.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">Offline ({offlineUsers.length})</span>
                    </div>
                    <div className="space-y-2">
                      {offlineUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="relative">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar_url || undefined} alt={getDisplayName(user)} />
                              <AvatarFallback className="text-xs">{getInitials(user)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-gray-400 rounded-full border-2 border-white"></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{getDisplayName(user)}</p>
                            <p className="text-xs text-gray-500">Offline</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {allUsers.length === 0 && (
                  <div className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No workspace members found</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <ChannelSettings
            channel={channel}
            onChannelUpdate={onChannelUpdate}
            onChannelDelete={onChannelDelete}
          />
        </div>
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