import { useEffect, useState } from "react";

const quotes = [
  {
    text: "Innovation is the ability to see change as an opportunity - not a threat.",
    author: "Steve Jobs"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "Social innovation is the future of innovation.",
    author: "Muhammad Yunus"
  },
  {
    text: "Every great innovation is built on a foundation of necessity.",
    author: "Anonymous"
  }
];

export function QuotesCarousel() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-md text-center animate-fade-in">
        <p className="text-2xl font-medium text-gray-800 mb-4">
          {quotes[currentQuote].text}
        </p>
        <p className="text-lg text-primary-600">
          - {quotes[currentQuote].author}
        </p>
      </div>
    </div>
  );
}