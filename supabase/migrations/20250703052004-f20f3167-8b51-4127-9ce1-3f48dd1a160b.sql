-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow workspace members to view projects in their workspace
CREATE POLICY "Workspace members can view projects" 
ON public.projects 
FOR SELECT 
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Allow workspace members to create projects in their workspace
CREATE POLICY "Workspace members can create projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  ) AND owner_id = auth.uid()
);

-- Allow project owners to update their projects
CREATE POLICY "Project owners can update their projects" 
ON public.projects 
FOR UPDATE 
USING (owner_id = auth.uid());

-- Allow project owners and workspace admins/owners to delete projects
CREATE POLICY "Project owners and workspace admins can delete projects" 
ON public.projects 
FOR DELETE 
USING (
  owner_id = auth.uid() OR 
  workspace_id IN (
    SELECT wm.workspace_id 
    FROM workspace_members wm 
    WHERE wm.user_id = auth.uid() 
    AND wm.role IN ('admin', 'owner')
  )
);