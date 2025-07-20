import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectBriefData {
  // Overview
  name: string;
  description: string;
  problem: string;
  customers: string;
  
  // Success Criteria  
  targetOutcomes: string;
  sdgs: string[];
  innovationTypes: string[];
  
  // Timeline & Team
  startDate: string;
  endDate: string;
  teamMembers: Array<{
    user_id: string;
    name: string;
    email: string;
    role: string;
    permission: string;
  }>;
  
  // Design Challenge
  designChallenge?: string;
}

export interface ProjectBriefState {
  data: ProjectBriefData;
  isLoading: boolean;
  isDirty: boolean;
  projectId: string | null;
}

const initialData: ProjectBriefData = {
  name: '',
  description: '',
  problem: '',
  customers: '',
  targetOutcomes: '',
  sdgs: [],
  innovationTypes: [],
  startDate: '',
  endDate: '',
  teamMembers: [],
  designChallenge: ''
};

export const useProjectBrief = (workspaceId: string | null) => {
  const [state, setState] = useState<ProjectBriefState>({
    data: initialData,
    isLoading: false,
    isDirty: false,
    projectId: null
  });
  const { toast } = useToast();

  const updateData = (updates: Partial<ProjectBriefData>, callback?: () => void) => {
    setState(prev => {
      const newState = {
        ...prev,
        data: { ...prev.data, ...updates },
        isDirty: true
      };
      if (callback) setTimeout(callback, 0); // call after state update
      return newState;
    });
  };

  const resetData = () => {
    setState({
      data: initialData,
      isLoading: false,
      isDirty: false,
      projectId: null
    });
  };

  const loadProjectBrief = async (projectId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    // console.log('-----LOADING project brief for projectId:', projectId);
    
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_members!inner (
            user_id,
            role,
            profiles!inner (
              first_name,
              last_name,
              email
            )
          )
        `)
        .eq('id', projectId)
        .single();
      // console.log('Project data:', project);
      if (error) throw error;

      if (project) {
        const metadata = (project.metadata as any) || {};
        const teamMembers = project.project_members?.map((member: any) => ({
          user_id: member.user_id,
          name: `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim(),
          email: member.profiles.email,
          role: member.role,
          permission: getPermissionFromRole(member.role)
        })) || [];

        setState({
          data: {
            name: project.name || '',
            description: project.description || '',
            problem: metadata.problem || '',
            customers: metadata.customers || '',
            targetOutcomes: metadata.targetOutcomes || '',
            sdgs: metadata.sdgs || [],
            innovationTypes: metadata.innovationTypes || [],
            startDate: project.start_date ? project.start_date.split('T')[0] : '',
            endDate: project.end_date ? project.end_date.split('T')[0] : '',
            teamMembers,
            designChallenge: metadata.designChallenge || ''
          },
          isLoading: false,
          isDirty: false,
          projectId
        });
      }
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "You need to be a project member to view or edit this project.",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const saveProjectBrief = async () => {
    if (!workspaceId) {
      throw new Error('No workspace selected');
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const metadata = {
        problem: state.data.problem,
        customers: state.data.customers,
        targetOutcomes: state.data.targetOutcomes,
        sdgs: state.data.sdgs,
        innovationTypes: state.data.innovationTypes,
        designChallenge: state.data.designChallenge,
        stage: state.data.designChallenge ? 'challenge_completed' : 'brief_completed',
        methodology: 'design_thinking',
        teamMembers: state.data.teamMembers
      };

      let projectData;

      if (state.projectId) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update({
            name: state.data.name,
            description: state.data.description,
            start_date: state.data.startDate ? state.data.startDate : null,
            end_date: state.data.endDate ? state.data.endDate : null,
            metadata,
            updated_at: new Date().toISOString()
          })
          .eq('id', state.projectId)
          .select()
          .single();

        if (error) throw error;
        projectData = data;
      } else {
        // Create new project
        // console.log('Creating new project');
        const { data, error } = await supabase
          .from('projects')
          .insert({
            name: state.data.name,
            description: state.data.description,
            workspace_id: workspaceId,
            owner_id: user.id,
            start_date: state.data.startDate ? state.data.startDate : null,
            end_date: state.data.endDate ? state.data.endDate : null,
            methodology_id: '550e8400-e29b-41d4-a716-446655440000',
            current_stage_id: '660e8400-e29b-41d4-a716-446655440001',
            status: 'active',
            metadata
          })
          .select()
          .single();

        if (error) throw error;
        projectData = data;

        setState(prev => ({ ...prev, projectId: data.id }));

        // Add owner to project_members as admin
        await supabase
          .from('project_members')
          .insert({
            project_id: data.id,
            user_id: user.id,
            workspace_id: workspaceId,
            role: 'admin'
          });
        // console.log('OWNER INSERTED TO PROJECT_MEMBERS');
      }

      // Update team members
      if (state.data.teamMembers.length > 0) {
        // Delete existing members (except owner)
        await supabase
          .from('project_members')
          .delete()
          .eq('project_id', projectData.id)
          .neq('user_id', user.id);

        // Insert new team members
        const membersToInsert = state.data.teamMembers.map(member => ({
          project_id: projectData.id,
          user_id: member.user_id,
          workspace_id: workspaceId,
          role: getRoleFromPermission(member.permission)
        }));

        await supabase
          .from('project_members')
          .insert(membersToInsert);
      }

      setState(prev => ({ ...prev, isLoading: false, isDirty: false }));
      
      toast({
        title: "Success",
        description: "Project brief saved successfully",
      });

      return projectData;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Error",
        description: "Failed to save project brief",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refetch = async () => {
    if (state.projectId) {
      const prevData = state.data;
      const prevString = JSON.stringify(prevData);
      await loadProjectBrief(state.projectId);
      const newString = JSON.stringify(state.data);
      if (prevString !== newString) {
        toast({
          title: 'Project brief reloaded',
          description: 'Latest saved content loaded from the database.',
        });
      }
    }
  };

  return {
    ...state,
    updateData,
    resetData,
    loadProjectBrief,
    saveProjectBrief,
    refetch
  };
};

// Helper functions
const getPermissionFromRole = (role: string): string => {
  switch (role) {
    case 'admin': return 'Admin';
    case 'editor': return 'Can edit';
    case 'viewer': return 'Can view';
    default: return 'Can view';
  }
};

const getRoleFromPermission = (permission: string): string => {
  switch (permission) {
    case 'Admin': return 'admin';
    case 'Can edit': return 'editor';
    case 'Can view': return 'viewer';
    default: return 'viewer';
  }
};