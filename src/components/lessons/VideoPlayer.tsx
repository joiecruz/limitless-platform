import { useState, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

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

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  console.log("[VideoPlayer] Received videoUrl:", videoUrl);
  
  if (!videoUrl) {
    console.log("[VideoPlayer] No video URL provided");
    return (
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-8 flex items-center justify-center">
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  // Check if it's a YouTube URL
  const youtubeVideoId = getYouTubeVideoId(videoUrl);
  
  if (youtubeVideoId) {
    console.log("[VideoPlayer] YouTube video ID:", youtubeVideoId);
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

  if (hasError) {
    return (
      <div className="relative aspect-video bg-muted md:rounded-lg overflow-hidden md:mb-8 flex flex-col items-center justify-center gap-3 px-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
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
        <a
          href={videoUrl}
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

  // Fallback to native video element for direct video files
  return (
    <div className="aspect-video bg-black md:rounded-lg overflow-hidden md:mb-8">
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full"
        onError={() => {
          console.error("[VideoPlayer] Video playback error for:", videoUrl);
          setHasError(true);
        }}
      >
        <source src={videoUrl} type={getMimeType(videoUrl)} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
