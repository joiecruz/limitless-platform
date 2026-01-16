import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  console.log("[VideoPlayer] Received videoUrl:", videoUrl);
  
  // Check if it's a valid URL
  if (!videoUrl) {
    console.log("[VideoPlayer] No video URL provided");
    return (
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-8 flex items-center justify-center">
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  // ReactPlayer handles YouTube, Vimeo, and many other video sources automatically
  const canPlay = ReactPlayer.canPlay(videoUrl);
  console.log("[VideoPlayer] ReactPlayer.canPlay:", canPlay);

  if (!canPlay) {
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
  }

  // Responsive wrapper pattern for ReactPlayer
  return (
    <div className="relative pt-[56.25%] mb-8 rounded-lg overflow-hidden bg-black">
      <ReactPlayer
        className="absolute top-0 left-0"
        url={videoUrl}
        width="100%"
        height="100%"
        controls
        onReady={() => console.log("[VideoPlayer] Player ready")}
        onError={(e) => console.error("[VideoPlayer] Error:", e)}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer;
