
import { Settings, Cast, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { useState, useEffect } from "react";

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if it's a YouTube URL
  const isYouTubeUrl = videoUrl?.match(/(youtube\.com|youtu\.be)/i) !== null;
  
  // Check if it's a Supabase Storage URL
  const isSupabaseUrl = videoUrl?.includes('supabase.co/storage/v1/object/public') || false;
  
  useEffect(() => {
    if (videoUrl) {
      setError(null);
      setIsReady(false);
    }
  }, [videoUrl]);

  const handleVideoError = (e: any) => {
    console.error("Video player error:", e);
    setError("Failed to load video. Please try again later.");
  };
  
  if (!videoUrl) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-8 flex items-center justify-center text-white">
        No video available
      </div>
    );
  }
  
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
            onError={handleVideoError}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                },
              },
            }}
          />
          {!isReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full relative">
          <video
            src={videoUrl}
            controls
            className="absolute inset-0 w-full h-full"
            onLoadedData={() => setIsReady(true)}
            onError={handleVideoError}
          >
            Your browser does not support the video tag.
          </video>
          
          {!isReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-900">
          <p className="text-red-400 mb-2">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
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
