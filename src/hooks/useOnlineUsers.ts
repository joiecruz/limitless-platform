import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OnlineUser {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface WorkspaceUsersData {
  onlineUsers: OnlineUser[];
  offlineUsers: OnlineUser[];
  allUsers: OnlineUser[];
}

export function useOnlineUsers(workspaceId: string | null): WorkspaceUsersData {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [allUsers, setAllUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!workspaceId) {
      setOnlineUsers([]);
      setAllUsers([]);
      return;
    }

    // Fetch all workspace users first
    const fetchAllWorkspaceUsers = async () => {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          profiles!inner (
            id,
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('workspace_id', workspaceId);

      if (error) {
        console.error('Error fetching workspace users:', error);
        return;
      }

      const users = data?.map((member: any) => member.profiles).filter(Boolean) as OnlineUser[] || [];
      setAllUsers(users);
    };

    fetchAllWorkspaceUsers();

    const channelName = `workspace_presence:${workspaceId}`;
    console.log("Setting up workspace presence for:", channelName);

    const presence = supabase.channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presence.presenceState();
        console.log('Workspace presence state:', presenceState);

        // Get all unique user IDs from presence state
        const userIds = new Set<string>();
        Object.values(presenceState).forEach((users: any) => {
          users.forEach((user: any) => {
            if (user.user_id) {
              userIds.add(user.user_id);
            }
          });
        });

        // Fetch user profiles for online users
        const fetchUserProfiles = async () => {
          if (userIds.size === 0) {
            setOnlineUsers([]);
            return;
          }

          const { data, error } = await supabase
            .from('profiles')
            .select('id, username, first_name, last_name, avatar_url')
            .in('id', Array.from(userIds));

          if (error) {
            console.error('Error fetching workspace online users:', error);
            return;
          }

          setOnlineUsers(data || []);
        };

        fetchUserProfiles();
      })
      .subscribe(async (status) => {
        console.log('Workspace presence subscription status:', status);
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await presence.track({
              user_id: user.id,
              workspace_id: workspaceId,
              online_at: new Date().toISOString(),
            });
          }
        }
      });

    return () => {
      presence.unsubscribe();
    };
  }, [workspaceId]);

  // Calculate offline users
  const onlineUserIds = new Set(onlineUsers.map(user => user.id));
  const offlineUsers = allUsers.filter(user => !onlineUserIds.has(user.id));

  return {
    onlineUsers,
    offlineUsers,
    allUsers
  };
}