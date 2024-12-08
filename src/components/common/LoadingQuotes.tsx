import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const quotes = [
  "Creativity is thinking new things, innovation is doing new things",
  "Innovation distinguishes between a leader and a follower",
  "The best way to predict the future is to create it",
  "Innovation is the ability to see change as an opportunity",
  "Every great innovation is built on a foundation of necessity",
  "The only way to discover the limits of the possible is to venture beyond them",
  "Innovation is taking two things that exist and putting them together in a new way",
  "Progress is impossible without change, and those who cannot change their minds cannot change anything"
];

export function LoadingQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-6 animate-fade-in">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-lg text-muted-foreground text-center max-w-md">
        {quotes[currentQuote]}
      </p>
    </div>
  );
}