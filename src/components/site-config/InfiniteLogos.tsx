import { ScrollingPlaceholders } from "./ScrollingPlaceholders";

interface InfiniteLogosProps {
  direction?: "left" | "right";
}

export function InfiniteLogos({ direction = "left" }: InfiniteLogosProps) {
  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <div
        className={`flex min-w-full animate-scroll-${direction}`}
        style={{
          width: "fit-content",
          animationDuration: "30s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
          willChange: "transform"
        }}
      >
        <ScrollingPlaceholders />
        <ScrollingPlaceholders />
      </div>
    </div>
  );
}