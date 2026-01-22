import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useWorkspaceDelete() {
  const { toast } = useToast();

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      // Get all projects in this workspace first
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('workspace_id', workspaceId);

      // Delete project-related data for each project
      if (projects && projects.length > 0) {
        const projectIds = projects.map(p => p.id);

        // Delete project members
        const { error: projectMembersError } = await supabase
          .from('project_members')
          .delete()
          .in('project_id', projectIds);
        if (projectMembersError) throw projectMembersError;

        // Delete project stages
        const { error: projectStagesError } = await supabase
          .from('project_stages')
          .delete()
          .in('project_id', projectIds);
        if (projectStagesError) throw projectStagesError;

        // Delete project steps
        const { error: projectStepsError } = await supabase
          .from('project_steps')
          .delete()
          .in('project_id', projectIds);
        if (projectStepsError) throw projectStepsError;

        // Delete project phases
        const { error: projectPhasesError } = await supabase
          .from('project_phases')
          .delete()
          .in('project_id', projectIds);
        if (projectPhasesError) throw projectPhasesError;

        // Delete stage contents
        const { error: stageContentsError } = await supabase
          .from('stage_contents')
          .delete()
          .in('project_id', projectIds);
        if (stageContentsError) throw stageContentsError;

        // Delete step contents
        const { error: stepContentsError } = await supabase
          .from('step_contents')
          .delete()
          .in('project_id', projectIds);
        if (stepContentsError) throw stepContentsError;

        // Delete ideas and related data
        const { data: ideas } = await supabase
          .from('ideas')
          .select('id')
          .in('project_id', projectIds);

        if (ideas && ideas.length > 0) {
          const ideaIds = ideas.map(i => i.id);

          const { error: ideaCommentsError } = await supabase
            .from('idea_comments')
            .delete()
            .in('idea_id', ideaIds);
          if (ideaCommentsError) throw ideaCommentsError;

          const { error: ideaLikesError } = await supabase
            .from('idea_likes')
            .delete()
            .in('idea_id', ideaIds);
          if (ideaLikesError) throw ideaLikesError;

          const { error: ideasError } = await supabase
            .from('ideas')
            .delete()
            .in('project_id', projectIds);
          if (ideasError) throw ideasError;
        }

        // Delete projects
        const { error: projectsError } = await supabase
          .from('projects')
          .delete()
          .eq('workspace_id', workspaceId);
        if (projectsError) throw projectsError;
      }

      // Get all design challenges in this workspace
      const { data: challenges } = await supabase
        .from('design_challenges')
        .select('id')
        .eq('workspace_id', workspaceId);

      if (challenges && challenges.length > 0) {
        const challengeIds = challenges.map(c => c.id);

        // Delete sticky notes
        const { error: stickyNotesError } = await supabase
          .from('sticky_notes')
          .delete()
          .in('challenge_id', challengeIds);
        if (stickyNotesError) throw stickyNotesError;

        // Delete design challenges
        const { error: challengesError } = await supabase
          .from('design_challenges')
          .delete()
          .eq('workspace_id', workspaceId);
        if (challengesError) throw challengesError;
      }

      // Get all channels and delete messages
      const { data: channels } = await supabase
        .from('channels')
        .select('id')
        .eq('workspace_id', workspaceId);

      if (channels && channels.length > 0) {
        const channelIds = channels.map(c => c.id);

        // Get all messages to delete reactions first
        const { data: messages } = await supabase
          .from('messages')
          .select('id')
          .in('channel_id', channelIds);

        if (messages && messages.length > 0) {
          const messageIds = messages.map(m => m.id);

          const { error: reactionsError } = await supabase
            .from('message_reactions')
            .delete()
            .in('message_id', messageIds);
          if (reactionsError) throw reactionsError;

          const { error: messagesError } = await supabase
            .from('messages')
            .delete()
            .in('channel_id', channelIds);
          if (messagesError) throw messagesError;
        }
      }

      // Delete workspace members
      const { error: membersError } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId);
      if (membersError) throw membersError;

      // Delete workspace domains
      const { error: domainsError } = await supabase
        .from('workspace_domains')
        .delete()
        .eq('workspace_id', workspaceId);
      if (domainsError) throw domainsError;

      // Delete workspace invitations
      const { error: invitationsError } = await supabase
        .from('workspace_invitations')
        .delete()
        .eq('workspace_id', workspaceId);
      if (invitationsError) throw invitationsError;

      // Delete channels
      const { error: channelsError } = await supabase
        .from('channels')
        .delete()
        .eq('workspace_id', workspaceId);
      if (channelsError) throw channelsError;

      // Finally delete the workspace
      const { error: workspaceError } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId);
      if (workspaceError) throw workspaceError;

      toast({
        title: "Success",
        description: "Workspace deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting workspace:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete workspace",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleDeleteWorkspace };
}