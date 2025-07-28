import { supabase } from "@/integrations/supabase/client";

export async function runWorkspaceMembersViewMigration() {
  try {
    // Create the view
    const { error: viewError } = await supabase.rpc('refresh_workspace_members_materialized');

    if (viewError) {
      console.error('Error creating view:', viewError);
      return false;
    }

    // Grant permissions - removed since we can't execute custom SQL
    // No additional grants needed for this migration

    // console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
} 