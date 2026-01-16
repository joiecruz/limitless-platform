import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  // Check if it's a valid URL
  if (!videoUrl) {
    return (
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-8 flex items-center justify-center">
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  // ReactPlayer handles YouTube, Vimeo, and many other video sources automatically
  const isExternalVideo = ReactPlayer.canPlay(videoUrl);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
      {isExternalVideo ? (
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
              },
            },
          }}
        />
      ) : (
        <video
          src={videoUrl}
          controls
          className="absolute inset-0 w-full h-full"
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;