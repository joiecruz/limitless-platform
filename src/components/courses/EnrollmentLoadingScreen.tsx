import { useEffect, useState } from "react";

interface EnrollmentLoadingScreenProps {
  courseTitle: string;
  onComplete: () => void;
}

const EnrollmentLoadingScreen = ({ courseTitle, onComplete }: EnrollmentLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Set a duration between 30-45 seconds (in milliseconds)
    const duration = Math.floor(Math.random() * (45000 - 30000) + 30000);
    const interval = 100; // Update every 100ms for smooth progress
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          onComplete();
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-md text-center space-y-4 p-6">
        <h2 className="text-2xl font-bold">
          Congratulations! 🎉
        </h2>
        <p className="text-lg text-muted-foreground">
          You are now enrolled in {courseTitle}
        </p>
        <div className="w-full bg-secondary rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnrollmentLoadingScreen;