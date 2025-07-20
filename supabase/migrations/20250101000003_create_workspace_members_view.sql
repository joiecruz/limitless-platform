-- Create a view that joins workspace_members with workspace_invitations through profiles
-- This provides a unified view of all workspace members and their invitation data

CREATE OR REPLACE VIEW workspace_members_with_invitations AS
SELECT 
  wm.user_id,
  wm.workspace_id,
  wm.role as member_role,
  wm.created_at as member_created_at,
  wm.last_active,
  p.first_name,
  p.last_name,
  p.email,
  p.id as profile_id,
  wi.id as invitation_id,
  wi.role as invitation_role,
  wi.status as invitation_status,
  wi.created_at as invitation_created_at,
  wi.accepted_at,
  wi.invited_by,
  wi.expires_at,
  CASE 
    WHEN wi.status = 'pending' THEN 'Pending'
    WHEN wi.status = 'accepted' THEN 'Active'
    WHEN wi.status = 'rejected' THEN 'Rejected'
    ELSE 'Active'
  END as display_status
FROM workspace_members wm
INNER JOIN profiles p ON wm.user_id = p.id
LEFT JOIN workspace_invitations wi ON (
  wi.email = p.email 
  AND wi.workspace_id = wm.workspace_id
);

-- Create a materialized view for better performance (optional)
-- This will need to be refreshed periodically
CREATE MATERIALIZED VIEW IF NOT EXISTS workspace_members_materialized AS
SELECT 
  wm.user_id,
  wm.workspace_id,
  wm.role as member_role,
  wm.created_at as member_created_at,
  wm.last_active,
  p.first_name,
  p.last_name,
  p.email,
  p.id as profile_id,
  wi.id as invitation_id,
  wi.role as invitation_role,
  wi.status as invitation_status,
  wi.created_at as invitation_created_at,
  wi.accepted_at,
  wi.invited_by,
  wi.expires_at,
  CASE 
    WHEN wi.status = 'pending' THEN 'Pending'
    WHEN wi.status = 'accepted' THEN 'Active'
    WHEN wi.status = 'rejected' THEN 'Rejected'
    ELSE 'Active'
  END as display_status
FROM workspace_members wm
INNER JOIN profiles p ON wm.user_id = p.id
LEFT JOIN workspace_invitations wi ON (
  wi.email = p.email 
  AND wi.workspace_id = wm.workspace_id
);

-- Create an index on the materialized view for better performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_materialized_workspace_id 
ON workspace_members_materialized(workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_members_materialized_user_id 
ON workspace_members_materialized(user_id);

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_workspace_members_materialized()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW workspace_members_materialized;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically refresh the materialized view
-- when workspace_members or workspace_invitations are updated
CREATE OR REPLACE FUNCTION trigger_refresh_workspace_members_materialized()
RETURNS trigger AS $$
BEGIN
  -- Refresh the materialized view asynchronously
  PERFORM pg_notify('refresh_workspace_members_materialized', '');
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers on both tables
CREATE TRIGGER refresh_workspace_members_materialized_trigger
  AFTER INSERT OR UPDATE OR DELETE ON workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_workspace_members_materialized();

CREATE TRIGGER refresh_workspace_invitations_materialized_trigger
  AFTER INSERT OR UPDATE OR DELETE ON workspace_invitations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_workspace_members_materialized();

-- Grant permissions
GRANT SELECT ON workspace_members_with_invitations TO authenticated;
GRANT SELECT ON workspace_members_materialized TO authenticated; 