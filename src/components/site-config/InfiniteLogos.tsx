import { ScrollingPlaceholders } from "./ScrollingPlaceholders";

interface InfiniteLogosProps {
  direction?: "left" | "right";
}

export function InfiniteLogos({ direction = "left" }: InfiniteLogosProps) {
  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <div
        className={`flex animate-scroll-${direction}`}
        style={{
          width: "max-content", // This ensures the container fits all logos
          animationDuration: "30s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
        }}
      >
        <ScrollingPlaceholders />
        <ScrollingPlaceholders />
      </div>
    </div>
  );
}