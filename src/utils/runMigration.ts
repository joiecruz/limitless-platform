import { supabase } from "@/integrations/supabase/client";

export async function runWorkspaceMembersViewMigration() {
  try {
    // Create the view
    const { error: viewError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (viewError) {
      console.error('Error creating view:', viewError);
      return false;
    }

    // Grant permissions
    const { error: grantError } = await supabase.rpc('exec_sql', {
      sql: `GRANT SELECT ON workspace_members_with_invitations TO authenticated;`
    });

    if (grantError) {
      console.error('Error granting permissions:', grantError);
      return false;
    }

    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
} 