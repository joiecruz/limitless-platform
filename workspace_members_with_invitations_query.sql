-- Query to get workspace members with their invitation data
-- This joins workspace_members with workspace_invitations through profiles table

SELECT 
  wm.user_id,
  wm.workspace_id,
  wm.role as member_role,
  wm.created_at as member_created_at,
  wm.last_active,
  p.first_name,
  p.last_name,
  p.email,
  wi.id as invitation_id,
  wi.role as invitation_role,
  wi.status as invitation_status,
  wi.created_at as invitation_created_at,
  wi.accepted_at,
  wi.invited_by
FROM workspace_members wm
INNER JOIN profiles p ON wm.user_id = p.id
LEFT JOIN workspace_invitations wi ON (
  wi.email = p.email 
  AND wi.workspace_id = wm.workspace_id
)
WHERE wm.workspace_id = 'your-workspace-id-here'
ORDER BY wm.created_at DESC;

-- Alternative query to get all workspace members and pending invitations
SELECT 
  'member' as type,
  wm.user_id,
  wm.workspace_id,
  wm.role,
  wm.created_at,
  p.first_name,
  p.last_name,
  p.email,
  NULL as invitation_id,
  NULL as invitation_status
FROM workspace_members wm
INNER JOIN profiles p ON wm.user_id = p.id
WHERE wm.workspace_id = 'your-workspace-id-here'

UNION ALL

SELECT 
  'invitation' as type,
  NULL as user_id,
  wi.workspace_id,
  wi.role,
  wi.created_at,
  NULL as first_name,
  NULL as last_name,
  wi.email,
  wi.id as invitation_id,
  wi.status as invitation_status
FROM workspace_invitations wi
WHERE wi.workspace_id = 'your-workspace-id-here'
  AND wi.status = 'pending'
ORDER BY created_at DESC; 