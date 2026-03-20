

## Problem

Users report video buffering during course playback. The `VideoPlayer` component currently uses `preload="metadata"`, which tells the browser to only fetch video metadata (duration, dimensions) upfront — not to buffer any actual video data. This means playback starts with almost no data buffered, causing frequent stalls especially on slower connections or when serving from Supabase Storage signed URLs.

Additionally, there is no visual buffering indicator — when the video stalls, users see a frozen frame with no feedback.

## Plan

### 1. Enable browser pre-buffering

Change `preload` from `"metadata"` to `"auto"`, allowing the browser to proactively download video data before the user presses play and to buffer ahead during playback.

### 2. Add buffering/loading indicator

Listen for the `waiting` event (fires when playback stalls due to insufficient data) and the `playing`/`canplay` events (fire when enough data is available). Show a spinner overlay on the video when the player is in a buffering state so users know the video is loading rather than broken.

### 3. Show loading state before video is ready

Listen for the `canplay` event to detect when the video has buffered enough to start. Show a loading spinner until that fires, replacing the current static "Loading video..." text with a proper overlay on the video element itself.

### File to modify

- **`src/components/lessons/VideoPlayer.tsx`** — Add `isBuffering` state, attach `waiting`/`playing`/`canplay` event handlers, render a spinner overlay when buffering, change `preload` to `"auto"`.

