

# Automated LimitlessBiz Course Invitations from Google Forms

## Overview

When someone submits your Google Form, two things happen:
1. **Your existing script** sends a general welcome/confirmation email (keeps working as-is)
2. **The new webhook** handles course access: checks if they have an account, grants access or creates a pending invitation, and sends a branded course invitation email with a clear call-to-action

These two emails serve different purposes and won't conflict.

## Potential Overlap to Consider

Both your existing welcome script and the new webhook will fire on form submission. The user will receive **two emails**:
- Your welcome email (from Google/your script)
- The course invitation email (from Limitless Lab via Resend)

**Options:**
- **Keep both** (recommended): The welcome email confirms their form submission; the course email gives them LMS access instructions. They serve distinct purposes.
- **Remove the welcome script later**: If you feel two emails is too many, you can disable the welcome script and let the course invitation email handle everything (it already includes a warm welcome message).

No changes are needed to your existing script either way.

## What We'll Build

### 1. New Edge Function: `google-form-webhook`

A secure endpoint that:
- Accepts POST requests from Google Apps Script
- Authenticates via a shared secret header (`x-webhook-secret`)
- Reuses the same logic from your existing `send-course-invite` function:
  - Checks if the email exists in `profiles`
  - **Existing users**: Grants `user_course_access` + `enrollments`, sends "Sign In & Start Learning" email
  - **New users**: Creates `pending_course_enrollments` record, sends "Create Your Account" email
- Supports a hardcoded LimitlessBiz course ID (or passed from the form)
- Returns success/error status

### 2. New Secret: `GOOGLE_FORM_WEBHOOK_SECRET`

A strong random key stored in Supabase secrets. You'll paste this same key into your Google Apps Script.

### 3. Config Update: `supabase/config.toml`

Add `verify_jwt = false` for the new function since it uses API key auth instead of user JWTs.

### 4. Google Apps Script (provided to you after deployment)

A short script (~15 lines) to add alongside your existing welcome email script in the same Google Form Script Editor. It extracts the email from the form response and calls the webhook.

## Setup Steps (Your Part)

1. Approve this plan
2. I'll ask you to add the webhook secret
3. I'll create and deploy the edge function
4. I'll provide the Google Apps Script snippet
5. You paste it into your Google Form's Script Editor (alongside your existing welcome email script)
6. Add a trigger for the new function on form submit

---

## Technical Details

### Edge Function: `google-form-webhook/index.ts`

```text
Authentication: x-webhook-secret header matched against GOOGLE_FORM_WEBHOOK_SECRET env var
JWT verification: disabled (API key auth)

Request body:
{
  "email": "user@example.com",
  "name": "Juan Dela Cruz"    // optional
}

Core logic (reused from send-course-invite):
1. Validate email format
2. Query profiles table for existing user
3a. Existing user -> insert user_course_access + enrollments, send "Sign In" email
3b. New user -> insert pending_course_enrollments, send "Create Account" email
4. Return { success: true, status: "existing_user_granted" | "pending_created" }
```

The LimitlessBiz course ID will be looked up by slug (`limitlessbiz`) or configured as a constant in the function to avoid requiring it from the form.

### Config: `supabase/config.toml`

```toml
[functions.google-form-webhook]
verify_jwt = false
```

### Google Apps Script (provided after deployment)

Will be a companion function in the same Script Editor as your welcome email script, triggered by the same form submit event. Both scripts run independently.

### Files to Create/Modify

| File | Change |
|------|--------|
| `supabase/functions/google-form-webhook/index.ts` | New edge function |
| `supabase/config.toml` | Add verify_jwt = false for new function |

### New Secret Required

| Secret | Purpose |
|--------|---------|
| `GOOGLE_FORM_WEBHOOK_SECRET` | Shared key between Google Apps Script and the webhook |

