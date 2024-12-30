import { useClientLogos } from "./hooks/useClientLogos";
import { LogoList } from "./LogoList";
import { ScrollingPlaceholders } from "./ScrollingPlaceholders";

interface InfiniteLogosProps {
  direction?: "left" | "right";
}

export function InfiniteLogos({ direction = "left" }: InfiniteLogosProps) {
  const { data: logos, isLoading } = useClientLogos();

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
        {isLoading || !logos ? (
          <>
            <ScrollingPlaceholders />
            <ScrollingPlaceholders />
          </>
        ) : (
          <>
            <LogoList logos={logos} />
            <LogoList logos={logos} />
          </>
        )}
      </div>
    </div>
  );
}