

# Plan: Switch to Email OTP (Code) Authentication

## Overview

You want to change the signup flow from requiring users to click an email link to instead entering a 6-digit verification code sent to their email. This is a **highly feasible** change with **low risk** of breaking your app.

---

## Current Authentication Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│                     CURRENT FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│  1. User enters email + password on /signup                     │
│  2. supabase.auth.signUp() is called                            │
│  3. User receives email with magic link                         │
│  4. User clicks link → redirected to dashboard                  │
│  5. Workspace created via handle-email-verification function    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Proposed OTP Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│                     NEW OTP FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│  1. User enters email + password on /signup                     │
│  2. supabase.auth.signUp() called with email confirmation       │
│  3. User stays on page, shown OTP input (Step 2)                │
│  4. User receives email with 6-digit code                       │
│  5. User enters code → supabase.auth.verifyOtp() called         │
│  6. On success → navigate to dashboard (onboarding if needed)   │
│  7. Workspace created via existing handle-email-verification    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feasibility Assessment

### Why This is Low Risk

1. **OTP Components Already Exist**: You already have the `InputOTP` component and a `Step2` component designed for OTP verification (currently unused in the main signup flow)

2. **Supabase Native Support**: Supabase has built-in `signInWithOtp()` and `verifyOtp()` methods specifically for this use case

3. **Minimal Changes Required**: The core authentication logic remains the same - only the verification step changes

4. **Existing Flows Unchanged**: The invited user flow uses a different path (`confirm-invited-user` edge function) and won't be affected

5. **Fallback Available**: Magic link emails still work as a backup

### Potential Edge Cases to Handle

| Scenario | Solution |
|----------|----------|
| User closes browser before entering code | Allow re-sending code via "Resend code" button |
| Code expires (default 5 min) | Show clear error message, offer resend option |
| User enters wrong code | Show validation error, allow retry |
| Email delivery delayed | "Resend code" button available after 60 seconds |

---

## Implementation Plan

### Step 1: Update SignUp Page (src/pages/SignUp.tsx)

- Add state for tracking the verification step (`showOtpVerification`)
- Store email temporarily after initial signup
- After successful `signUp()`, show OTP verification UI instead of redirecting
- Add `verifyOtp()` call when user submits the code

### Step 2: Create OTP Verification Component

- Create a new `EmailOtpVerification` component that:
  - Displays the 6-digit OTP input (reuse existing InputOTP)
  - Shows the email address being verified
  - Has "Verify" button that calls `supabase.auth.verifyOtp()`
  - Has "Resend code" button with rate limiting
  - Has option to go back and change email

### Step 3: Update Supabase Auth Email Template (Optional Enhancement)

- The default Supabase OTP email template includes a 6-digit code
- You can customize this in Supabase Dashboard > Authentication > Email Templates
- No code changes required - this is configuration only

### Step 4: Handle Post-Verification Flow

- After successful OTP verification, trigger the existing `handle-email-verification` edge function
- Navigate to dashboard with onboarding modal if needed
- This matches the current post-verification behavior

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/SignUp.tsx` | Add OTP verification step after initial signup |
| `src/components/signup/EmailOtpVerification.tsx` | New component for OTP entry UI |
| `src/components/signup/types.ts` | Add OTP-related types if needed |

---

## Technical Details

### Key Supabase Methods

```typescript
// Step 1: Sign up user (triggers OTP email automatically)
const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

// Step 2: Verify the OTP code entered by user
const { data, error } = await supabase.auth.verifyOtp({
  email,
  token: otpCode,  // 6-digit code from email
  type: 'email'    // or 'signup' depending on configuration
});

// Resend OTP if needed
const { error } = await supabase.auth.resend({
  type: 'signup',
  email,
});
```

### What Stays the Same

- Password validation and requirements
- Invited user flow (uses separate `confirm-invited-user` edge function)
- Profile creation (handled by database trigger)
- Workspace creation (handled by `handle-email-verification` edge function)
- Onboarding flow after verification
- Sign-in page (unaffected)

---

## Risk Summary

| Risk | Level | Mitigation |
|------|-------|------------|
| Breaking existing users | Very Low | Only affects new signups |
| Invited users affected | None | Uses separate confirmation flow |
| Email delivery issues | Low | Same as current magic link delivery |
| Code expiration confusion | Low | Clear messaging + resend option |
| User experience | Improved | No need to leave the app |

---

## Benefits

1. **Better UX**: Users stay in the app instead of switching to email client
2. **Mobile-friendly**: Especially helpful on mobile where switching apps is cumbersome
3. **Faster verification**: 6-digit code is quicker than finding and clicking a link
4. **Reduced friction**: Users report higher completion rates with OTP vs magic links
5. **Existing infrastructure**: Leverages components and patterns already in your codebase

---

## Recommendation

This change is **recommended** and can be implemented safely. The existing Step2 component and InputOTP infrastructure make this a straightforward enhancement with minimal risk to your application.

