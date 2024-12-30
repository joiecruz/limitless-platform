import { useClientLogos } from "./hooks/useClientLogos";
import { cn } from "@/lib/utils";

interface InfiniteLogosProps {
  direction?: "left" | "right";
  logoGroup?: "rectangular" | "square";
}

export function InfiniteLogos({ direction = "left", logoGroup = "rectangular" }: InfiniteLogosProps) {
  const { data: logos, isLoading } = useClientLogos();

  if (isLoading || !logos) {
    return null;
  }

  // Filter logos based on their shape/type
  const rectangularLogos = [
    "USAID", "US Embassy", "ASEAN Foundation", "The Asia Foundation",
    "Bloomberg Philantrophies", "Department of Health", "Department of Agriculture",
    "ABS-CBN Foundation", "University of the Philippines", "Gokongwei Brothers Foundation"
  ];

  const filteredLogos = logos.filter(logo => 
    logoGroup === "rectangular" 
      ? rectangularLogos.includes(logo.name)
      : !rectangularLogos.includes(logo.name)
  );

  // Quadruple the logos array to ensure smooth infinite scrolling
  const quadrupledLogos = [...filteredLogos, ...filteredLogos, ...filteredLogos, ...filteredLogos];

  return (
    <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
      <div
        className={cn(
          "flex min-w-full shrink-0 gap-12 py-4",
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right",
          "absolute top-0 left-0"
        )}
      >
        {quadrupledLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex-shrink-0"
          >
            <img
              src={logo.image_url}
              alt={logo.name}
              className="h-20 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 gap-12 py-4",
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right",
          "absolute top-0 left-[100%]"
        )}
        aria-hidden="true"
      >
        {quadrupledLogos.map((logo, index) => (
          <div
            key={`${logo.id}-clone-${index}`}
            className="flex-shrink-0"
          >
            <img
              src={logo.image_url}
              alt={logo.name}
              className="h-20 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}