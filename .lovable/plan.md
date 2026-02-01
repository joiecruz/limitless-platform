
# Plan: Redesigned Signup Flow with Integrated Onboarding

## Overview

Transform the signup process from a two-step email+password form into a 4-screen progressive flow that integrates onboarding directly into the signup process. This keeps users engaged and eliminates the post-login onboarding modal.

---

## New Signup Flow Structure

```text
┌─────────────────────────────────────────────────────────────────┐
│                     NEW 4-SCREEN SIGNUP FLOW                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCREEN 1: Email Entry + OTP Verification                       │
│  ├─ User enters email                                          │
│  ├─ Clicks "Continue" → OTP sent to email                      │
│  └─ 6-digit code input appears inline                          │
│      └─ On successful verification → Screen 2                  │
│                                                                 │
│  SCREEN 2: Personal Info                                        │
│  ├─ Minimal centered layout                                    │
│  ├─ "Tell us more about you"                                   │
│  ├─ First Name, Last Name                                      │
│  └─ Password (with requirements)                               │
│                                                                 │
│  SCREEN 3: Company Info                                         │
│  ├─ Minimal centered layout                                    │
│  ├─ Company Name (text input)                                  │
│  └─ Role (Which best describes you?)                           │
│                                                                 │
│  SCREEN 4: Goals                                                │
│  ├─ Minimal centered layout                                    │
│  ├─ "How do you want to use Limitless Lab?"                    │
│  └─ Goal selection (existing checkboxes)                       │
│      └─ On submit → Create account & redirect to dashboard     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. OTP Verification First (Email-Only)

The user only enters their email initially. After OTP verification, they proceed to set their password. This:
- Ensures email is verified before any profile data is collected
- Reduces friction by not asking for password upfront
- Uses the `signUp` with a temporary password, then updates after OTP verification

### 2. Minimal Centered Layout

Screens 2-4 will use a clean, centered layout with:
- Logo at top
- Progress indicator (step dots or bar)
- Single content area with form fields
- Back/Continue buttons at bottom
- No sidebar/quotes on these screens for focus

### 3. Data Collection Restructure

| Current Onboarding | New Screen | Notes |
|---|---|---|
| First Name, Last Name | Screen 2 | Combined with password |
| Role | Screen 3 | Moved here |
| Company Size | Screen 3 | Renamed to "Company Name" per your request |
| Goals | Screen 4 | Kept as is |
| Referral Source | Removed | Simplifying the flow |
| Workspace Name | Dashboard | Moved to post-login if needed |

### 4. Account Creation Timing

- **After OTP verification (Screen 1)**: User account is created in Supabase Auth with the verified email
- **After Screen 2**: Password is set using `updateUser({ password })`
- **After Screen 4**: Profile data saved, redirect to dashboard

---

## Implementation Plan

### Step 1: Create New Multi-Step Signup Page

Replace the current `SignUp.tsx` with a multi-step form component:

- State management for current step (1-4)
- Form data accumulator across all steps
- Step-specific validation

### Step 2: Screen 1 - Email + OTP Verification

Create a new component that:
- Shows email input with "Continue" button
- After submission, calls `supabase.auth.signUp({ email, password: temporaryPassword })`
- Shows inline OTP input (transitions within same screen)
- Verifies OTP with `supabase.auth.verifyOtp()`
- On success, proceeds to Screen 2

### Step 3: Screen 2 - Personal Info + Password

Create component with:
- Centered minimal layout
- First Name + Last Name inputs
- Password input with requirements
- "Continue" button that validates and updates password via `supabase.auth.updateUser({ password })`

### Step 4: Screen 3 - Company Info

Create component with:
- Company Name text input (stored as workspace name reference)
- Role dropdown (existing RoleField component)
- "Continue" button

### Step 5: Screen 4 - Goals Selection

Adapt existing goals selection:
- Goal checkboxes (existing Step2 from onboarding)
- "Complete Setup" button
- On submit: save profile data, create workspace if company name provided, redirect to dashboard

### Step 6: Update Dashboard Onboarding Logic

Modify Dashboard.tsx to:
- Skip onboarding modal for users who completed new signup flow
- Only show workspace creation if user doesn't have one and didn't provide company name

### Step 7: Create Shared Minimal Layout Component

Create a reusable layout for Screens 2-4:
- Logo at top
- Progress indicator
- Content slot
- Consistent padding and centering

---

## Files to Create/Modify

| File | Action | Description |
|---|---|---|
| `src/pages/SignUp.tsx` | Modify | Complete rewrite as multi-step flow |
| `src/components/signup/SignupStep1.tsx` | Create | Email + OTP verification screen |
| `src/components/signup/SignupStep2.tsx` | Create | Personal info + password screen |
| `src/components/signup/SignupStep3.tsx` | Create | Company name + role screen |
| `src/components/signup/SignupStep4.tsx` | Create | Goals selection screen |
| `src/components/signup/SignupLayout.tsx` | Create | Minimal centered layout wrapper |
| `src/components/signup/SignupProgress.tsx` | Create | Step progress indicator |
| `src/components/signup/types.ts` | Modify | Add new form data types |
| `src/pages/Dashboard.tsx` | Modify | Update onboarding detection logic |
| `src/components/onboarding/OnboardingModal.tsx` | Modify | Handle workspace-only scenario |

---

## Technical Details

### New SignupFormData Type

```typescript
interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  role: string;
  goals: string[];
}
```

### Authentication Flow

```typescript
// Screen 1: Create account with temporary password
const tempPassword = generateSecurePassword();
await supabase.auth.signUp({ email, password: tempPassword });

// After OTP verification, user is logged in
await supabase.auth.verifyOtp({ email, token: code, type: 'email' });

// Screen 2: Update to user's chosen password
await supabase.auth.updateUser({ password: userPassword });

// Screen 4: Save profile
await supabase.from('profiles').upsert({
  id: user.id,
  email: user.email,
  first_name: firstName,
  last_name: lastName,
  role: role,
  goals: goals.join(', '),
});

// Create workspace if company name provided
if (companyName) {
  await supabase.rpc('create_workspace_with_owner', {
    workspace_name: companyName,
    workspace_slug: generateSlug(companyName),
    owner_id: user.id
  });
}
```

---

## UI/UX Specifications

### Minimal Layout Design

- White/light background
- Logo centered at top
- Progress dots (4 dots, filled = completed/current)
- Content area max-width ~400px, centered
- Adequate vertical spacing
- No sidebar on mobile or desktop for these screens

### Progress Indicator

```text
  ●  ●  ○  ○     (Step 2 of 4)
```

### Responsive Behavior

- Mobile: Full width, stacked layout
- Desktop: Centered card-like appearance, no sidebar

---

## Migration Considerations

### What Happens to Existing Users?

- Existing users signing in are unaffected
- The onboarding modal remains for edge cases (invited users, incomplete profiles)
- Dashboard will check if profile has first_name/last_name to determine if onboarding is needed

### Rollback Plan

- Keep existing onboarding modal intact
- Can revert SignUp.tsx if issues arise
- No database schema changes required

---

## Benefits

1. **Streamlined Experience**: Users complete everything in one flow
2. **Better Completion Rates**: Progressive disclosure keeps users engaged
3. **Verified Emails First**: Ensures email validity before collecting data
4. **Simpler Dashboard**: No confusing modal popup after login
5. **Mobile Optimized**: Focused screens work better on small devices
6. **Reuses Existing Components**: RoleField, PasswordRequirements, InputOTP
