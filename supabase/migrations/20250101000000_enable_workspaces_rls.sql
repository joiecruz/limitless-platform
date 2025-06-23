-- Enable Row Level Security on workspaces table
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Also ensure the create_workspace_with_owner function exists
CREATE OR REPLACE FUNCTION create_workspace_with_owner(
  workspace_name text,
  workspace_slug text,
  owner_id uuid
)
RETURNS json AS $$
DECLARE
  workspace_record record;
BEGIN
  -- Insert the workspace
  INSERT INTO public.workspaces (name, slug)
  VALUES (workspace_name, workspace_slug)
  RETURNING * INTO workspace_record;

  -- Add the creator as owner
  INSERT INTO public.workspace_members (user_id, workspace_id, role)
  VALUES (owner_id, workspace_record.id, 'owner');

  -- Return the workspace as JSON
  RETURN row_to_json(workspace_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;