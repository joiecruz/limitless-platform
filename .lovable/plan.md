
# Fix Course Invite Flow for New Signup Process

## Problem Summary

The new 6-step signup flow (`SignUp.tsx`) does not handle course invitations that were working with the old onboarding modal. Two critical pieces are missing:

1. **Pre-filling email from invite links** - Invite emails send users to `/signup?email=user@example.com` but the form ignores this parameter
2. **Processing pending course enrollments** - After signup, users should automatically get access to courses they were pre-invited to

---

## Solution Overview

```text
CURRENT FLOW (BROKEN):
  Invite Email → /signup?email=user@example.com → User signs up → NO course access granted

FIXED FLOW:
  Invite Email → /signup?email=user@example.com → Email pre-filled → User signs up → Course access granted automatically
```

---

## Changes Required

### 1. Pre-fill Email from URL Parameter

**File:** `src/components/signup/SignupStep1.tsx`

Read the `email` query parameter from the URL and pre-populate the email field:

```typescript
import { useSearchParams } from "react-router-dom";

// Inside component:
const [searchParams] = useSearchParams();
const emailFromUrl = searchParams.get("email") || "";

// Initialize state with URL param:
const [email, setEmail] = useState(data.email || emailFromUrl);
```

This ensures invited users see their email already filled in when they land on the signup page.

---

### 2. Process Pending Course Enrollments After Signup

**File:** `src/pages/SignUp.tsx`

Add the missing enrollment logic to the `handleComplete` function. This should be added after the profile upsert and workspace creation:

```typescript
// After workspace creation, check for pending course enrollments
const { data: pendingEnrollments, error: pendingError } = await supabase
  .from('pending_course_enrollments')
  .select('id, course_id, metadata')
  .eq('email', user.email)
  .is('processed_at', null);

if (!pendingError && pendingEnrollments && pendingEnrollments.length > 0) {
  console.log('Found pending course enrollments:', pendingEnrollments.length);
  
  for (const pending of pendingEnrollments) {
    // Check if user already has course access
    const { data: existingAccess } = await supabase
      .from('user_course_access')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', pending.course_id)
      .maybeSingle();

    if (!existingAccess) {
      // Grant course access
      const { error: accessError } = await supabase
        .from('user_course_access')
        .insert({
          user_id: user.id,
          course_id: pending.course_id
        });

      if (accessError) {
        console.error('Error granting course access:', accessError);
      } else {
        console.log('Granted course access for course:', pending.course_id);
        // Store the course ID to show welcome dialog on dashboard
        localStorage.setItem('granted_course_access', pending.course_id);
      }
    }

    // Mark pending enrollment as processed
    await supabase
      .from('pending_course_enrollments')
      .update({ processed_at: new Date().toISOString() })
      .eq('id', pending.id);
  }
}
```

---

## Technical Details

### Files to Modify

| File | Change |
|------|--------|
| `src/components/signup/SignupStep1.tsx` | Add `useSearchParams` hook to read email from URL and pre-fill the input field |
| `src/pages/SignUp.tsx` | Add pending course enrollment processing logic in `handleComplete` function |

### Data Flow

```text
1. Admin sends bulk invite → pending_course_enrollments record created
2. User clicks email link → /signup?email=... 
3. SignupStep1 reads ?email param → pre-fills email field
4. User completes 6-step signup
5. handleComplete runs:
   a. Creates/updates profile
   b. Creates workspace
   c. NEW: Queries pending_course_enrollments for user's email
   d. NEW: For each pending enrollment:
      - Inserts into user_course_access
      - Updates pending_course_enrollments.processed_at
   e. Sets localStorage flag for welcome dialog
6. User lands on dashboard → LimitlessBizAvailableDialog shows if applicable
```

---

## Testing Recommendations

After implementation:
1. Create a test pending course enrollment for a new email
2. Visit `/signup?email=test@example.com` and verify email is pre-filled
3. Complete full signup flow
4. Verify `user_course_access` record is created
5. Verify `pending_course_enrollments.processed_at` is set
6. Confirm course appears in user's dashboard with access
