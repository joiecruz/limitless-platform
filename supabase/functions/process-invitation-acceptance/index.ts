import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase credentials");
    }

    // Properly validate the JWT
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { user }, error: userError } = await authClient.auth.getUser(token);
    if (userError || !user || !user.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { invitation_id } = await req.json();
    if (!invitation_id) {
      throw new Error("Missing invitation_id");
    }

    // Fetch the invitation server-side. Trust ONLY its values.
    const { data: invitation, error: invErr } = await supabase
      .from('workspace_invitations')
      .select('id, email, workspace_id, role, status')
      .eq('id', invitation_id)
      .single();

    if (invErr || !invitation) {
      return new Response(JSON.stringify({ error: 'Invitation not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (invitation.status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Invitation is not pending' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Caller must match the invited email
    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const workspace_id = invitation.workspace_id;
    const role = invitation.role;
    const user_id = user.id;

    // Check if user is already a member
    const { data: existingMember, error: memberCheckError } = await supabase
      .from('workspace_members')
      .select('user_id')
      .eq('workspace_id', workspace_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (memberCheckError) {
      throw new Error(`Error checking membership: ${memberCheckError.message}`);
    }

    if (existingMember) {
      await supabase
        .from('workspace_invitations')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', invitation_id);

      return new Response(
        JSON.stringify({ success: true, message: "User is already a member of this workspace" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({ workspace_id, user_id, role });

    if (memberError) {
      throw new Error(`Error adding member: ${memberError.message}`);
    }

    await supabase
      .from('workspace_invitations')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', invitation_id);

    return new Response(
      JSON.stringify({ success: true, message: "User successfully added to workspace" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error in process-invitation-acceptance function:", error);
    return new Response(
      JSON.stringify({ error: 'Operation failed. Please try again or contact support.' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
};

serve(handler);
