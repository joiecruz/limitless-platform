
# Fix: Get 6-Digit OTP Code Instead of Magic Link

## Root Cause (The Real Problem)

Supabase's `signInWithOtp({ email })` function uses the **"Magic Link" email template** which is configured to send a clickable button/link by default. The "OTP Length: 6 digits" setting you saw in the dashboard only applies to **phone/SMS authentication**, not email.

The email template in Supabase contains `{{ .ConfirmationURL }}` (a link) but not `{{ .Token }}` (the 6-digit code).

---

## Solution Options

### Option A: Modify Supabase Email Template (Recommended - No Code Changes)

This is a configuration change in your Supabase dashboard:

1. Go to **Supabase Dashboard** > **Authentication** > **Email Templates**
2. Select the **"Magic Link"** template
3. Edit the template to include the OTP token code

**Replace the template with something like:**
```html
<h2>Your verification code</h2>
<p>Enter this code to verify your email:</p>
<h1 style="font-size: 32px; letter-spacing: 8px; text-align: center;">{{ .Token }}</h1>
<p>This code expires in 60 minutes.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

The `{{ .Token }}` variable contains the 6-digit OTP code that will work with your current frontend code.

---

### Option B: Use Custom Edge Function with Resend (More Control)

If you want full control over the email content and don't want to modify Supabase templates:

1. Create an edge function that generates and stores OTP codes
2. Send custom emails via Resend (already configured)
3. Verify codes against stored values

**Files to create:**
- `supabase/functions/send-otp/index.ts` - Generate OTP, store in DB, send via Resend
- `supabase/functions/verify-otp/index.ts` - Verify the code

**Database table needed:**
```sql
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Frontend changes:**
- Replace `supabase.auth.signInWithOtp()` with edge function calls
- After OTP verified, use `supabase.auth.signUp()` to create the user

---

## Recommendation

**Go with Option A** - It requires no code changes and will work immediately:

1. Open: Supabase Dashboard > Authentication > Email Templates
2. Edit the "Magic Link" template
3. Add `{{ .Token }}` to display the 6-digit code
4. Save the template

Your current frontend code is already correctly set up to:
- Send the OTP via `signInWithOtp`
- Collect 6 digits via the `InputOTP` component
- Verify via `verifyOtp({ type: 'email', token: code })`

The only missing piece is the email template showing the code instead of a link.

---

## Quick Reference: Supabase Email Template Variables

| Variable | Description |
|----------|-------------|
| `{{ .Token }}` | The 6-digit OTP code |
| `{{ .ConfirmationURL }}` | The magic link URL |
| `{{ .Email }}` | User's email address |
| `{{ .SiteURL }}` | Your configured site URL |

---

## Action Required

Go to your Supabase dashboard and update the Magic Link email template to include `{{ .Token }}`.

**Direct link:** https://supabase.com/dashboard/project/crllgygjuqpluvdpwayi/auth/templates
