-- SECURITY FIX: Fix workspace_invitations table to prevent unauthorized access
-- The current policies allow public access to sensitive invitation data

-- Drop all problematic public policies
DROP POLICY IF EXISTS "Allow access for magic link" ON public.workspace_invitations;
DROP POLICY IF EXISTS "Allow users with valid token to read invitations" ON public.workspace_invitations;
DROP POLICY IF EXISTS "Workspace members view all invitations" ON public.workspace_invitations;

-- Keep the secure authenticated policies but ensure they're restrictive
-- Drop and recreate to ensure they're properly configured
DROP POLICY IF EXISTS "Workspace members can view invitations" ON public.workspace_invitations;
DROP POLICY IF EXISTS "Workspace admins can create invitations" ON public.workspace_invitations;
DROP POLICY IF EXISTS "Workspace admins can delete invitations" ON public.workspace_invitations;
DROP POLICY IF EXISTS "Allow users to accept their invitations" ON public.workspace_invitations;

-- Create secure SELECT policy - only workspace members can view invitations for their workspace
CREATE POLICY "Secure workspace invitation access" 
ON public.workspace_invitations 
FOR SELECT 
TO authenticated 
USING (
  -- Only workspace members can view invitations for their workspace
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
  OR
  -- Or superadmins can view all invitations for management purposes
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  )
);

-- Allow invited users to view their own pending invitations (via email match)
CREATE POLICY "Users can view their own invitations" 
ON public.workspace_invitations 
FOR SELECT 
TO authenticated 
USING (
  email = (SELECT email FROM profiles WHERE id = auth.uid())
  AND status = 'pending'
  AND expires_at > now()
);

-- Workspace admins can create invitations for their workspace
CREATE POLICY "Workspace admins can create invitations" 
ON public.workspace_invitations 
FOR INSERT 
TO authenticated 
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  )
);

-- Workspace admins can delete invitations for their workspace
CREATE POLICY "Workspace admins can delete invitations" 
ON public.workspace_invitations 
FOR DELETE 
TO authenticated 
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  )
);

-- Allow users to update (accept/reject) their own invitations
CREATE POLICY "Users can update their own invitations" 
ON public.workspace_invitations 
FOR UPDATE 
TO authenticated 
USING (
  email = (SELECT email FROM profiles WHERE id = auth.uid())
  AND status = 'pending'
  AND expires_at > now()
)
WITH CHECK (
  email = (SELECT email FROM profiles WHERE id = auth.uid())
  AND status IN ('accepted', 'rejected')
);