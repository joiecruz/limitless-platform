import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChannelSidebar } from "@/components/community/ChannelSidebar";
import { ChatArea } from "@/components/community/ChatArea";
import { useCommunityChannels } from "@/hooks/useCommunityChannels";
import { useCommunityMessages } from "@/hooks/useCommunityMessages";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const { toast } = useToast();
  const { publicChannels, privateChannels, activeChannel, setActiveChannel } = useCommunityChannels(workspaceId);
  const { messages, sendMessage } = useCommunityMessages(activeChannel);

  useEffect(() => {
    const fetchUserWorkspace = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!user) {
          console.log("No user found");
          return;
        }
        console.log("User found:", user.id);

        // Get user's workspace memberships
        const { data: workspaceMembers, error: memberError } = await supabase
          .from("workspace_members")
          .select(`
            workspace_id,
            workspaces (
              id,
              name,
              slug
            )
          `)
          .eq("user_id", user.id);

        if (memberError) {
          console.error("Error fetching workspace members:", memberError);
          toast({
            title: "Error",
            description: "Failed to load workspace",
            variant: "destructive",
          });
          return;
        }

        // Use the first workspace if available
        if (workspaceMembers && workspaceMembers.length > 0) {
          console.log("Workspace members found:", workspaceMembers);
          setWorkspaceId(workspaceMembers[0].workspace_id);
        } else {
          console.log("No workspace memberships found");
        }
      } catch (error) {
        console.error("Error in fetchUserWorkspace:", error);
        toast({
          title: "Error",
          description: "Failed to load workspace",
          variant: "destructive",
        });
      }
    };

    fetchUserWorkspace();
  }, []);

  const handleCreatePrivateChannel = async (name: string) => {
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "Workspace not loaded",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a channel",
        variant: "destructive",
      });
      return;
    }

    const { data: channel, error } = await supabase
      .from("channels")
      .insert([
        {
          name,
          workspace_id: workspaceId,
          is_public: false,
          description: `Private channel created by ${user.email}`,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating channel:", error);
      toast({
        title: "Error",
        description: "Failed to create channel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Channel "${name}" created successfully`,
    });
  };

  return (
    <div className="fixed inset-0 lg:left-64 pt-0 flex">
      <ChannelSidebar
        publicChannels={publicChannels}
        privateChannels={privateChannels}
        activeChannel={activeChannel}
        onChannelSelect={setActiveChannel}
        onCreatePrivateChannel={handleCreatePrivateChannel}
      />
      <ChatArea 
        activeChannel={activeChannel}
        messages={messages}
        onSendMessage={sendMessage}
      />
    </div>
  );
}