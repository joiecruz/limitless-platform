

## Problem

Linux Mint (and many Linux distributions) do not ship with proprietary H.264 video codecs by default. When users play MP4 videos in Firefox on Linux Mint, the browser can decode the AAC audio track but not the H.264 video track — resulting in audio-only playback with a black screen. The `<video>` element does not fire an `error` event in this case, so the fallback UI never appears.

## Root Cause

The `VideoPlayer` component only provides a single `<source>` with `video/mp4`. On Linux systems without `gstreamer1.0-libav` or `ffmpeg` codecs installed, H.264 decoding fails silently for the video stream.

## Plan

### 1. Detect codec support and show guidance

Add runtime codec detection using `MediaSource.isTypeSupported()` or `HTMLVideoElement.canPlayType()` to check for H.264 support. If unsupported, show a helpful message instead of a black screen.

### 2. Monitor for audio-only playback

Listen for the `loadedmetadata` event on the `<video>` element. If `videoWidth === 0` and `videoHeight === 0` after metadata loads, that indicates the video track failed to decode. In that case, display the error fallback UI with Linux-specific guidance to either:
- Install the missing codec package (`sudo apt install mint-meta-codecs` or `ubuntu-restricted-extras`)
- Use Google Chrome (which bundles its own H.264 decoder)
- Open the video directly via the download link

### 3. Update error fallback UI

Enhance the existing error fallback to include a Linux-specific message when the codec issue is detected, distinguishing it from general playback errors.

### Files to modify

- **`src/components/lessons/VideoPlayer.tsx`** — Add `onLoadedMetadata` handler checking `videoWidth/videoHeight`, add codec detection, and update error UI with Linux codec instructions.

