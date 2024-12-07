import { Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Channel, Message } from "@/types/community";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ChatAreaProps {
  activeChannel: Channel | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatArea({ activeChannel, messages, onSendMessage }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {activeChannel && (
        <div className="border-b px-6 py-4">
          <div className="flex items-center">
            <Hash className="h-5 w-5 text-gray-400 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">{activeChannel.name}</h1>
          </div>
          {activeChannel.description && (
            <p className="text-sm text-gray-500 mt-1">{activeChannel.description}</p>
          )}
        </div>
      )}

      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {message.profiles?.username?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {message.profiles?.username || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(message.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${activeChannel?.name || ''}`}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button type="submit" disabled={!newMessage.trim()}>Send</Button>
        </form>
      </div>
    </div>
  );
}