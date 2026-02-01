
# Fix: "Auth Session Missing" After OTP Verification

## Problem Identified

The custom OTP verification flow only validates the 6-digit code against the database - it does **not** create a Supabase authentication session. When the user proceeds to Step 2, the code tries to call `supabase.auth.updateUser({ password })`, which requires an authenticated user session that doesn't exist.

**Current Flow (Broken):**
```text
Step 1: Email + OTP verified (custom edge function) --> No Supabase session created
Step 2: Calls supabase.auth.updateUser() --> ERROR: Auth session missing!
```

---

## Solution

After successfully verifying the OTP code, we need to **create the Supabase user account** and establish an authenticated session before proceeding to Step 2.

**Fixed Flow:**
```text
Step 1: Email + OTP verified (custom edge function)
        --> Create user with supabase.auth.signUp()
        --> User session now exists
Step 2: Calls supabase.auth.updateUser() --> SUCCESS
```

---

## Implementation Changes

### 1. Update verify-otp Edge Function

Modify the edge function to create the user in Supabase Auth after OTP verification:

**File:** `supabase/functions/verify-otp/index.ts`

- After marking OTP as used, create the user using Admin API
- Generate a temporary password (will be changed in Step 2)
- Sign in the user and return the session

```typescript
// After OTP verification succeeds, create the user
const tempPassword = crypto.randomUUID(); // Temporary, will be changed in Step 2

const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
  email: email,
  password: tempPassword,
  email_confirm: true, // Already confirmed via OTP
});

if (signUpError) {
  // If user already exists, sign them in instead
  if (signUpError.message.includes('already registered')) {
    // Handle existing user case
  }
}

// Generate session for the user
const { data: sessionData } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: email,
});

return new Response(JSON.stringify({ 
  success: true, 
  verified: true,
  access_token: sessionData?.properties?.access_token,
  refresh_token: sessionData?.properties?.refresh_token,
}));
```

### 2. Update SignupStep1 Frontend

After receiving the session tokens from verify-otp, set the session in the Supabase client:

**File:** `src/components/signup/SignupStep1.tsx`

```typescript
// After successful OTP verification
const response = await supabase.functions.invoke('verify-otp', {
  body: { email, code: verificationCode },
});

if (response.data?.access_token) {
  // Set the session in Supabase client
  await supabase.auth.setSession({
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  });
}

onEmailVerified(email);
```

---

## Technical Details

### Why This Works

1. **User Creation**: The edge function uses `supabase.auth.admin.createUser()` with the service role key to create users directly
2. **Email Pre-confirmed**: Since we already verified the email via OTP, we set `email_confirm: true`
3. **Session Established**: The access/refresh tokens returned allow the frontend to establish a valid session
4. **Step 2 Works**: With a session in place, `updateUser({ password })` can now succeed

### Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/verify-otp/index.ts` | Add user creation and session generation after OTP verification |
| `src/components/signup/SignupStep1.tsx` | Handle session tokens from verify-otp response |

### Edge Cases Handled

- **Existing User**: If email already registered, generate a sign-in link instead
- **Session Refresh**: Tokens allow the frontend to maintain the session across page refreshes
- **Password Update**: Temporary password is replaced in Step 2 when user sets their real password

---

## Summary

The fix connects the custom OTP verification to Supabase's authentication system by:
1. Creating the user account after OTP verification
2. Returning session tokens to the frontend
3. Establishing the session before proceeding to password setup

This ensures a seamless flow where the user is authenticated immediately after email verification.
