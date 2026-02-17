

# Automated Course Completion Reminders for LimitlessBiz

## Overview

Create a scheduled edge function that automatically emails enrolled users who haven't completed the LimitlessBiz course, nudging them to continue learning. The reminder checks each user's progress and sends a personalized email with their completion percentage and a direct link to resume.

## How It Works

1. A **scheduled edge function** runs on a regular cadence (e.g., weekly every Monday at 9 AM)
2. It queries all enrollments for the LimitlessBiz course where progress is less than 100%
3. For each incomplete user, it sends a branded reminder email via Resend with:
   - Their name and current progress (e.g., "You've completed 2 of 28 lessons")
   - A call-to-action button linking to the course
4. To avoid spamming, it tracks the last reminder sent date so users only get one email per cycle

## What We'll Build

### 1. New Database Column: `last_reminder_sent_at`

Add a timestamp column to the `enrollments` table to track when the last reminder was sent. This prevents sending duplicate reminders.

### 2. New Edge Function: `send-course-reminders`

A function that:
- Fetches all LimitlessBiz enrollments where progress < 100% and last reminder was sent more than 7 days ago (or never)
- Sends a personalized Resend email to each user
- Updates `last_reminder_sent_at` after sending
- Returns a summary of how many reminders were sent

### 3. Scheduled Cron Job

A `pg_cron` job that calls the edge function weekly (e.g., every Monday at 9:00 AM UTC).

### 4. Optional: Manual Trigger Button (Admin UI)

An admin button on the course management page to manually trigger reminders on demand, without waiting for the schedule.

## Current Data Snapshot

- **Course**: LimitlessBiz: AI for MSME Advancement (28 lessons)
- **Most enrolled users have 0% progress** -- reminders will be very useful here
- Emails are sent via **Resend** (already configured with `RESEND_API_KEY` and `FROM_EMAIL`)

## Setup Steps

1. Approve this plan
2. I'll add the `last_reminder_sent_at` column to `enrollments`
3. I'll create and deploy the `send-course-reminders` edge function
4. I'll set up the weekly cron schedule via SQL
5. Optionally, I'll add a "Send Reminders Now" button in the admin course page

---

## Technical Details

### Database Migration

```text
ALTER TABLE enrollments
ADD COLUMN last_reminder_sent_at TIMESTAMPTZ DEFAULT NULL;
```

### Edge Function: `send-course-reminders/index.ts`

```text
Authentication: Service role key (no JWT needed, called by cron)
verify_jwt = false

Logic:
1. Query enrollments for the LimitlessBiz course where:
   - progress < 100
   - last_reminder_sent_at IS NULL OR last_reminder_sent_at < NOW() - INTERVAL '7 days'
2. Join with profiles to get email and first_name
3. Join with lessons to get total lesson count
4. For each user, send a Resend email with:
   - Subject: "Continue your LimitlessBiz journey"
   - Body: progress stats + CTA button to course page
5. Update last_reminder_sent_at = NOW() for each sent email
6. Return { success: true, sent_count: N, skipped_count: M }
```

### Cron Job (pg_cron + pg_net)

```text
Schedule: Every Monday at 9:00 AM UTC
Calls: POST to send-course-reminders edge function
Auth: Service role key in Authorization header
```

### Config Update: `supabase/config.toml`

```text
[functions.send-course-reminders]
verify_jwt = false
```

### Files to Create/Modify

| File | Change |
|------|--------|
| `supabase/functions/send-course-reminders/index.ts` | New edge function |
| `supabase/config.toml` | Add verify_jwt = false |
| Database migration | Add `last_reminder_sent_at` column |
| SQL insert | Create pg_cron schedule |
| `src/pages/admin/courses/tabs/` (optional) | Add manual trigger button |

### Email Template

The reminder email will follow the same branding as the existing course invitation emails (Limitless Lab logo, branded colors, clear CTA button) with content tailored to encourage course continuation.

