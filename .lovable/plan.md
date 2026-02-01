
# Fix: Email OTP Code Not Being Sent

## Root Cause

The current code uses `supabase.auth.signUp()` which sends a **magic link** by default, not a 6-digit OTP code. This is why no code is being received.

To receive an OTP code via email, we need to use `supabase.auth.signInWithOtp()` instead.

---

## Solution

Change the authentication approach to use `signInWithOtp` which properly sends a 6-digit verification code:

### Current (Not Working)
```typescript
// This sends a LINK, not a code
await supabase.auth.signUp({
  email,
  password: tempPassword,
});
```

### Fixed Approach
```typescript
// This sends a 6-digit OTP code
await supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: true, // Creates user if doesn't exist
  }
});
```

---

## Updated Flow

```text
SCREEN 1: Email + OTP
├─ User enters email
├─ Call signInWithOtp() → 6-digit code sent
├─ User enters code
└─ Call verifyOtp() → User authenticated

SCREEN 2: Personal Info + Password
├─ User enters name fields
├─ User sets password
└─ Call updateUser({ password }) → Password saved

(Screens 3-4 remain unchanged)
```

---

## Changes Required

### File: `src/components/signup/SignupStep1.tsx`

1. **Replace `signUp` with `signInWithOtp`**:
   - Use `signInWithOtp({ email, options: { shouldCreateUser: true } })`
   - This properly triggers the OTP email with a 6-digit code

2. **Update OTP verification type**:
   - Change from `type: 'email'` to `type: 'email'` (this stays the same, but works with signInWithOtp)

3. **Update to 6 digits**:
   - Change `maxLength={4}` to `maxLength={6}`
   - Add back slots 4 and 5 for the OTP input
   - Update all validation checks from 4 to 6

4. **Update resend function**:
   - Change `resend({ type: 'signup' })` to call `signInWithOtp` again

---

## Technical Summary

| Item | Before | After |
|------|--------|-------|
| Initial email action | `signUp()` with temp password | `signInWithOtp()` |
| Email content | Magic link | 6-digit code |
| OTP digits | 4 (wrong) | 6 (correct) |
| User creation | During signUp | During signInWithOtp with `shouldCreateUser: true` |
| Resend method | `resend({ type: 'signup' })` | `signInWithOtp()` again |

This approach works seamlessly with Supabase's built-in email system without requiring custom SMTP configuration.
