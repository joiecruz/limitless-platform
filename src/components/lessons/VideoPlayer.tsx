
import { Settings, Cast, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  
  // Check if it's a YouTube URL using a more robust method
  const isYouTubeUrl = videoUrl?.match(/(youtube\.com|youtu\.be)/i) !== null;
  
  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
      {isYouTubeUrl ? (
        <div className={`w-full h-full ${!isReady ? 'bg-gray-900 flex items-center justify-center' : ''}`}>
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls
            playing={false}
            onReady={() => setIsReady(true)}
            onError={(e) => console.error("Video player error:", e)}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                },
              },
            }}
          />
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      ) : videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="absolute inset-0 w-full h-full"
          onError={(e) => console.error("Native video error:", e)}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          No video available
        </div>
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
