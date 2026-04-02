

# Make Newsletter Subscribe Button Functional

## What Changes

**File:** `src/components/site-config/Footer.tsx`

Add state management and a submit handler to call the external Supabase edge function at `https://bdzwxcdzwneufdwxwejm.supabase.co/functions/v1/subscribe`.

### Changes:
1. Add `useState` for email input, loading state, and success/error feedback
2. Add form `onSubmit` handler that POSTs to the subscribe endpoint with the email
3. Show loading spinner on the button while submitting
4. Show success toast on success, error toast on failure
5. Clear the input and show a brief success message after subscribing

### Technical Details
- Use `useState` for `email`, `isLoading`, and `subscribeStatus`
- Validate email is non-empty before submitting
- Call `fetch()` directly to the other app's edge function URL (no Supabase client needed since it's a different project)
- Use the existing `toast` from `@/hooks/use-toast` for feedback
- Disable the button during loading, show `Loader2` spinner icon

