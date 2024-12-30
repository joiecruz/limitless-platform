import { useClientLogos } from "./hooks/useClientLogos";
import { LogoList } from "./LogoList";
import { ScrollingPlaceholders } from "./ScrollingPlaceholders";

interface InfiniteLogosProps {
  direction?: "left" | "right";
}

export function InfiniteLogos({ direction = "left" }: InfiniteLogosProps) {
  const { data: logos, isLoading } = useClientLogos();

  console.log('Logos data:', logos);

  return (
    <div className="relative w-screen overflow-hidden bg-transparent -mx-4 sm:-mx-6 lg:-mx-8">
      <div
        className={`flex animate-scroll-${direction}`}
        style={{
          width: "max-content",
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