import { useState, useRef, useEffect, useCallback } from 'react';
import { AlertTriangle, Monitor, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VideoPlayerProps {
  videoUrl: string;
}

// Extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extract bucket and path from a Supabase signed URL
const parseSupabaseSignedUrl = (url: string): { bucket: string; path: string } | null => {
  const match = url.match(/\/storage\/v1\/object\/sign\/([^/?]+)\/(.+?)(?:\?|$)/);
  if (!match) return null;
  return { bucket: match[1], path: decodeURIComponent(match[2]) };
};

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const [hasError, setHasError] = useState(false);
  const [codecIssue, setCodecIssue] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect H.264 codec support
  const checkH264Support = useCallback((): boolean => {
    const video = document.createElement('video');
    const canPlay = video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    return canPlay === 'probably' || canPlay === 'maybe';
  }, []);

  // Handle loadedmetadata — detect audio-only (video track failed to decode)
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video && video.videoWidth === 0 && video.videoHeight === 0) {
      console.warn('[VideoPlayer] Video track not decoded (videoWidth=0). Likely missing H.264 codec.');
      setCodecIssue(true);
      setHasError(true);
    }
  }, []);

  // Resolve signed URLs on mount
  useEffect(() => {
    setHasError(false);
    setResolvedUrl(null);

    if (!videoUrl) return;

    const parsed = parseSupabaseSignedUrl(videoUrl);
    if (parsed) {
      // Generate a fresh signed URL (valid for 1 year)
      supabase.storage
        .from(parsed.bucket)
        .createSignedUrl(parsed.path, 60 * 60 * 24 * 365)
        .then(({ data, error }) => {
          if (error || !data?.signedUrl) {
            console.error('[VideoPlayer] Failed to refresh signed URL:', error);
            setResolvedUrl(videoUrl); // fallback to original
          } else {
            setResolvedUrl(data.signedUrl);
          }
        });
    } else {
      setResolvedUrl(videoUrl);
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-8 flex items-center justify-center">
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  // Check if it's a YouTube URL
  const youtubeVideoId = getYouTubeVideoId(videoUrl);
  
  if (youtubeVideoId) {
    return (
      <div className="relative aspect-video bg-black md:rounded-lg overflow-hidden md:mb-8">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&playsinline=1`}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (!resolvedUrl) {
    return (
      <div className="relative aspect-video bg-black md:rounded-lg overflow-hidden md:mb-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="relative aspect-video bg-muted md:rounded-lg overflow-hidden md:mb-8 flex flex-col items-center justify-center gap-3 px-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        {codecIssue ? (
          <>
            <p className="text-sm text-muted-foreground text-center font-medium">
              Your browser can't decode this video — likely due to missing H.264 codecs on your system.
            </p>
            <div className="bg-background/80 rounded-lg p-4 max-w-md text-left space-y-2">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Monitor className="h-4 w-4" /> Linux users — try one of these fixes:
              </p>
              <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                <li>
                  Install codecs:{' '}
                  <code className="bg-muted px-1 py-0.5 rounded text-[11px]">sudo apt install mint-meta-codecs</code>{' '}
                  or{' '}
                  <code className="bg-muted px-1 py-0.5 rounded text-[11px]">ubuntu-restricted-extras</code>
                </li>
                <li>
                  Use{' '}
                  <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" className="underline font-medium text-primary">
                    Google Chrome
                  </a>{' '}
                  (includes built-in H.264 support)
                </li>
                <li>Open the video directly using the link below</li>
              </ul>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            This video couldn't be played. Try using{' '}
            <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              Google Chrome
            </a>{' '}
            or{' '}
            <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              Firefox
            </a>{' '}
            for the best experience.
          </p>
        )}
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary underline"
        >
          Open video directly
        </a>
      </div>
    );
  }

  // Determine MIME type from URL
  const getMimeType = (url: string): string => {
    const lower = url.toLowerCase().split('?')[0];
    if (lower.endsWith('.webm')) return 'video/webm';
    if (lower.endsWith('.ogg') || lower.endsWith('.ogv')) return 'video/ogg';
    return 'video/mp4';
  };

  return (
    <div className="relative aspect-video bg-black md:rounded-lg overflow-hidden md:mb-8">
      {isBuffering && !hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full"
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => setIsBuffering(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onError={() => {
          console.error("[VideoPlayer] Video playback error for:", resolvedUrl);
          setHasError(true);
        }}
      >
        <source src={resolvedUrl} type={getMimeType(resolvedUrl)} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
