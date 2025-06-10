import { useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChannelSidebar } from "@/components/community/ChannelSidebar";
import { ChatArea } from "@/components/community/ChatArea";
import { useCommunityChannels } from "@/hooks/useCommunityChannels";
import { useCommunityMessages } from "@/hooks/useCommunityMessages";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGlobalRole } from "@/hooks/useGlobalRole";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";
import { Menu, X } from "lucide-react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { Message, Channel } from "@/types/community";
import { WorkspaceSelector } from "@/components/layout/WorkspaceSelector";
import { Navigation } from "@/components/layout/Navigation";

export default function Community() {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { publicChannels, privateChannels, activeChannel, setActiveChannel } = useCommunityChannels(currentWorkspace?.id || null);
  const { messages, sendMessage, isLoading, forceRefresh } = useCommunityMessages(activeChannel);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const { is_superadmin, is_admin } = useGlobalRole();
  const { data: workspaceRole } = useWorkspaceRole(currentWorkspace?.id || "");

  // Calculate if user can post in the active channel
  const canPost = () => {
    if (!activeChannel?.read_only) {
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

  const isReadOnlyDisabled = activeChannel?.read_only && !canPost();

  // Update local messages when messages from hook change
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Handle message updates from reactions
  const handleMessageUpdate = useCallback((updatedMessage: Message) => {
    setLocalMessages(current =>
      current.map(msg =>
        msg.id === updatedMessage.id
          ? { ...msg, message_reactions: updatedMessage.message_reactions }
          : msg
      )
    );
  }, []);

  // Handle channel updates
  const handleChannelUpdate = useCallback((updatedChannel: Channel) => {
    // Update the active channel if it's the one being updated
    if (activeChannel?.id === updatedChannel.id) {
      setActiveChannel(updatedChannel);
    }
    // Note: Channel list updates are handled by real-time subscriptions in the hook

    toast({
      title: "Success",
      description: "Channel updated successfully",
    });
  }, [activeChannel, setActiveChannel, toast]);

  // Handle channel deletion
  const handleChannelDelete = useCallback(() => {
    // Clear active channel since it was deleted
    setActiveChannel(null);
    // Note: Channel list updates are handled by real-time subscriptions in the hook

    toast({
      title: "Success",
      description: "Channel deleted successfully",
    });
  }, [setActiveChannel, toast]);

  // Close sidebar automatically when selecting a channel on mobile
  const handleChannelSelect = (channel: any) => {
    setActiveChannel(channel);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleCreatePrivateChannel = async (name: string, wsId: string) => {
    try {
      const { data, error } = await supabase
        .from("channels")
        .insert([
          {
            name,
            workspace_id: wsId,
            is_public: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Private channel "${name}" created successfully`,
      });

      // Set the new channel as active
      setActiveChannel(data);
    } catch (error) {
      console.error("Error creating private channel:", error);
      toast({
        title: "Error",
        description: "Failed to create private channel",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex bg-gray-50 overflow-hidden">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setShowNavigation(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <ChannelSidebar
          publicChannels={publicChannels}
          privateChannels={privateChannels}
          activeChannel={activeChannel}
          onChannelSelect={handleChannelSelect}
          onCreatePrivateChannel={handleCreatePrivateChannel}
          workspaceId={currentWorkspace?.id || ""}
        />
      </div>

      {/* Mobile navigation overlay (replaces channel sidebar) */}
      {isMobile && showNavigation && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowNavigation(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <img
                  src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
                  alt="Limitless Lab"
                  className="h-8 w-auto"
                />
                <button onClick={() => setShowNavigation(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="px-4 py-4 border-b">
                <WorkspaceSelector
                  currentWorkspace={currentWorkspace}
                  setCurrentWorkspace={setCurrentWorkspace}
                />
              </div>
              <div className="flex-1 px-4 py-4 overflow-y-auto">
                <Navigation />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile channel sidebar overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80">
            <ChannelSidebar
              publicChannels={publicChannels}
              privateChannels={privateChannels}
              activeChannel={activeChannel}
              onChannelSelect={handleChannelSelect}
              onCreatePrivateChannel={handleCreatePrivateChannel}
              workspaceId={currentWorkspace?.id || ""}
            />
          </div>
        </>
      )}

      {/* Chat Area Container */}
      <div className="flex-1 lg:p-4 p-0 overflow-hidden">
        <ChatArea
          activeChannel={activeChannel}
          messages={localMessages}
          onSendMessage={sendMessage}
          onMessageUpdate={handleMessageUpdate}
          onChannelUpdate={handleChannelUpdate}
          onChannelDelete={handleChannelDelete}
          onOpenChannels={() => setSidebarOpen(true)}
          isLoading={isLoading}
          isReadOnlyDisabled={isReadOnlyDisabled}
        />
      </div>
    </div>
  );
}
