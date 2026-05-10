## Problem

When someone tries to sign up with an email that already has an account:

- The current "you already have an account" banner in `SignupStep1` queries `public.profiles` from the browser as an anonymous user. RLS on `profiles` only allows users to read their own row, so this query **always returns empty** for anonymous visitors. The banner never shows.
- The user clicks Continue, `send-otp` issues a brand-new OTP, and the email is sent. If the address has previously bounced/complained on Resend, or the user looks in the wrong inbox, they "don't receive a verification email" — exactly what your friend reported.
- Even if the OTP arrives and they verify it, they end up confused because they already have a password-based account.

## Fix

Move the "does this email already have an account?" check to the server, where it has the privileges to actually answer, and surface a clear, actionable message before any OTP is sent.

### 1. New edge function: `check-email-exists`

- Public (no JWT required), accepts `{ email }`.
- Uses the service role to call `supabase.auth.admin.listUsers` (filtered by email) and returns `{ exists: boolean }`.
- No data leaks beyond a boolean — same information email enumeration would already reveal via the existing signup/sign-in flows.

### 2. `send-otp` becomes the safety net

- Before generating/sending an OTP, call the same admin lookup.
- If a user already exists, short-circuit with `{ error: "account_exists" }` and HTTP 409. No OTP row is inserted, no email is sent.
- This guarantees that even if the frontend check is bypassed, we never email an OTP to an existing account.

### 3. `SignupStep1.tsx` UX changes

- Replace the broken `profiles` lookup in `useEffect` and `handleEmailBlur` with a call to `check-email-exists`.
- When `exists === true`:
  - Show the existing inline blue banner, but expand the copy to: *"An account with this email already exists. [Sign in instead] or [reset your password]."*
  - Disable the Continue button (currently it's still clickable).
- In `handleSendCode`, if `send-otp` returns `account_exists`, set the same banner and skip moving to the OTP step (instead of showing a generic destructive toast).
- Keep the pre-filled invite-email check working by routing it through the same edge function.

### 4. Sanity pass on neighboring flows

- `src/components/invite/services/userService.ts` already handles "already a member" — no change needed.
- Sign-in page already exists at `/signin`; password reset link points to the existing `/reset-password` flow.

## Out of scope

- No changes to `verify-otp`, OTP table schema, or Resend templates.
- No change to the legacy `src/components/signup/steps/Step1.tsx` (the active flow is `SignupStep1.tsx`; the legacy file is unused by the signup route — I'll confirm and only touch it if it's still wired up).

## Files touched

- `supabase/functions/check-email-exists/index.ts` (new)
- `supabase/config.toml` (register new function as public)
- `supabase/functions/send-otp/index.ts` (early-return when account exists)
- `src/components/signup/SignupStep1.tsx` (use new function, disable Continue, better banner + handle 409)

## Verification

- Try signup with a known-existing email → banner appears on blur, Continue disabled, no OTP email sent.
- Try signup with a brand-new email → OTP is sent as today.
- Hit `send-otp` directly with an existing email → returns 409 `account_exists`, no row in `otp_codes`, no Resend call.
