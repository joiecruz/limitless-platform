import { ScrollingPlaceholders } from "./ScrollingPlaceholders";

interface InfiniteLogosProps {
  direction?: "left" | "right";
}

export function InfiniteLogos({ direction = "left" }: InfiniteLogosProps) {
  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <div
        className={`flex animate-scroll-${direction} items-center`}
        style={{
          animationDuration: "30s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
          width: "fit-content",
        }}
      >
        <ScrollingPlaceholders />
        <ScrollingPlaceholders />
      </div>
    </div>
  );
}