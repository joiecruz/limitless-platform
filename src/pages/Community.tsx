
// import { useState, useEffect } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { ChannelSidebar } from "@/components/community/ChannelSidebar";
// import { ChatArea } from "@/components/community/ChatArea";
// import { useCommunityChannels } from "@/hooks/useCommunityChannels";
// import { useCommunityMessages } from "@/hooks/useCommunityMessages";
// import { useToast } from "@/hooks/use-toast";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Community() {
  // const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const { toast } = useToast();
  // const isMobile = useIsMobile();
  // const { publicChannels, privateChannels, activeChannel, setActiveChannel } = useCommunityChannels(workspaceId);
  // const { messages, sendMessage } = useCommunityMessages(activeChannel);

  // // Close sidebar automatically when selecting a channel on mobile
  // const handleChannelSelect = (channel: any) => {
  //   setActiveChannel(channel);
  //   if (isMobile) {
  //     setSidebarOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   const fetchUserWorkspace = async () => {
  //     try {
  //       const { data: { user }, error: userError } = await supabase.auth.getUser();
  //       if (userError) throw userError;

  //       if (!user) {
  //         console.log("No user found");
  //         return;
  //       }
  //       console.log("User found:", user.id);

  //       const { data: workspaceMembers, error: memberError } = await supabase
  //         .from("workspace_members")
  //         .select(`
  //           workspace_id,
  //           workspaces (
  //             id,
  //             name,
  //             slug
  //           )
  //         `)
  //         .eq("user_id", user.id);

  //       if (memberError) {
  //         console.error("Error fetching workspace members:", memberError);
  //         toast({
  //           title: "Error",
  //           description: "Failed to load workspace",
  //           variant: "destructive",
  //         });
  //         return;
  //       }

  //       if (workspaceMembers && workspaceMembers.length > 0) {
  //         console.log("Workspace members found:", workspaceMembers);
  //         setWorkspaceId(workspaceMembers[0].workspace_id);
  //       } else {
  //         console.log("No workspace memberships found");
  //       }
  //     } catch (error) {
  //       console.error("Error in fetchUserWorkspace:", error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to load workspace",
  //         variant: "destructive",
  //       });
  //     }
  //   };

  //   fetchUserWorkspace();
  // }, []);

  // const handleCreatePrivateChannel = async (name: string, wsId: string) => {
  //   if (!wsId) {
  //     toast({
  //       title: "Error",
  //       description: "Workspace not loaded",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   const { data: { user } } = await supabase.auth.getUser();

  //   if (!user) {
  //     toast({
  //       title: "Error",
  //       description: "You must be logged in to create a channel",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   // Check if a channel with this name already exists in the workspace
  //   const { data: existingChannels, error: checkError } = await supabase
  //     .from("channels")
  //     .select()
  //     .eq("workspace_id", wsId)
  //     .eq("name", name);

  //   if (checkError) {
  //     console.error("Error checking existing channels:", checkError);
  //     toast({
  //       title: "Error",
  //       description: "Failed to check existing channels",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (existingChannels && existingChannels.length > 0) {
  //     toast({
  //       title: "Error",
  //       description: "A channel with this name already exists in this workspace",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   // Create the new private channel
  //   const { data: channel, error } = await supabase
  //     .from("channels")
  //     .insert({
  //       name,
  //       workspace_id: wsId,
  //       is_public: false,
  //       description: `Private channel created by ${user.email}`,
  //     })
  //     .select()
  //     .single();

  //   if (error) {
  //     console.error("Error creating channel:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to create channel",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   console.log("Created private channel:", channel);
  //   toast({
  //     title: "Success",
  //     description: `Channel "${name}" created successfully`,
  //   });
  // };
  return (
    // <div className="fixed inset-0 lg:left-64 pt-0 flex flex-col">
    //   {/* Mobile header */}
    //   <div className="md:hidden flex items-center bg-white border-b px-4 py-2 z-10">
    //     <button
    //       onClick={() => setSidebarOpen(true)}
    //       className="p-2 mr-2 text-gray-600"
    //     >
    //       <Menu className="h-6 w-6" />
    //     </button>
    //     <div className="font-medium">
    //       {activeChannel ? activeChannel.name : 'Community'}
    //     </div>
    //   </div>

    //   <div className="relative flex-1 flex overflow-hidden">
    //     {/* Mobile backdrop */}
    //     {sidebarOpen && isMobile && (
    //       <div
    //         className="fixed inset-0 bg-black bg-opacity-50 z-20"
    //         onClick={() => setSidebarOpen(false)}
    //       />
    //     )}

    //     {/* Sidebar */}
    //     <div className={`
    //       ${isMobile ? 'fixed inset-y-0 left-0 z-30 w-64 transform transition-transform ease-in-out duration-300 bg-white' : 'w-64 border-r'}
    //       ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
    //     `}>
    //       <ChannelSidebar
    //         publicChannels={publicChannels}
    //         privateChannels={privateChannels}
    //         activeChannel={activeChannel}
    //         onChannelSelect={handleChannelSelect}
    //         onCreatePrivateChannel={handleCreatePrivateChannel}
    //         workspaceId={workspaceId || ""}
    //       />
    //     </div>

    //     {/* Main content */}
    //     <div className="flex-1 overflow-hidden">
    //       <ChatArea
    //         activeChannel={activeChannel}
    //         messages={messages}
    //         onSendMessage={sendMessage}
    //       />
    //     </div>
    //   </div>
    <div className="container mx-auto py-8">
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Users className="h-16 w-16 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">Community In Development</h1>
        <p className="text-gray-500 max-w-md">
          We're working on building an amazing community experience. Stay tuned for updates!
        </p>
      </div>
    </Card>
    </div>
  );
}
