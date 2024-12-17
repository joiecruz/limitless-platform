import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  emails: string[];
  workspaceId: string;
  workspaceName: string;
  inviterName: string;
  role: string;
  inviterId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY || !FROM_EMAIL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Server configuration error");
    }

    const { emails, workspaceId, workspaceName, inviterName, role, inviterId } = await req.json() as InviteRequest;

    if (!emails?.length || !workspaceId || !workspaceName || !inviterName || !role || !inviterId) {
      throw new Error("Missing required fields in invitation request");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const batchId = crypto.randomUUID();

    // Create invitations for all emails
    const { data: invitations, error: inviteError } = await supabase
      .from('workspace_invitations')
      .insert(
        emails.map(email => ({
          workspace_id: workspaceId,
          email: email.toLowerCase(),
          role,
          invited_by: inviterId,
          status: 'pending',
          batch_id: batchId,
          emails: emails
        }))
      )
      .select();

    if (inviteError) {
      throw inviteError;
    }

    // Send emails for each invitation
    const emailPromises = invitations.map(async (invitation) => {
      const inviteUrl = `${req.headers.get("origin")}/invite?token=${invitation.magic_link_token}`;
      
      return fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [invitation.email],
          subject: `Join ${workspaceName} on our platform`,
          html: `
            <!DOCTYPE html>
            <html>
              <body>
                <h2>You've been invited!</h2>
                <p>${inviterName} has invited you to join ${workspaceName} as a ${role}.</p>
                <p>Click the link below to accept the invitation:</p>
                <a href="${inviteUrl}">Accept Invitation</a>
              </body>
            </html>
          `,
        }),
      });
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ success: true, count: emails.length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-workspace-invite function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while processing your request",
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);