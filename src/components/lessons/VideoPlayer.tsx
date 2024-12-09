import { Settings, Cast, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const isYouTubeUrl = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
      {isYouTubeUrl ? (
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls
          playing
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
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <Cast className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;