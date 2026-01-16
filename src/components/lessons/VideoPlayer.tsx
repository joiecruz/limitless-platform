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
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback to native video element for direct video files
  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
      <video
        src={videoUrl}
        controls
        className="absolute inset-0 w-full h-full object-contain"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
