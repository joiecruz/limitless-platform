import { useState, useEffect } from "react";

interface Logo {
  id: string;
  name: string;
  image_url: string;
}

const staticLogos: Logo[] = [
  {
    id: "1",
    name: "USAID",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%201.svg"
  },
  {
    id: "2",
    name: "US Embassy",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%202.svg"
  },
  {
    id: "3",
    name: "ASEAN Foundation",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%203.svg"
  },
  {
    id: "4",
    name: "The Asia Foundation",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%204.svg"
  },
  {
    id: "5",
    name: "DICT",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%205.svg"
  }
];

export function InfiniteLogos({ direction = "left" }: { direction?: "left" | "right" }) {
  const [logos, setLogos] = useState<Logo[]>(staticLogos);

  // Double the logos array to create seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative flex overflow-hidden py-4 bg-background">
      <div
        className={`flex animate-scroll-${direction} items-center`}
        style={{
          animationDuration: "30s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
          width: "fit-content",
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="mx-8 flex items-center justify-center"
          >
            <img
              src={logo.image_url}
              alt={logo.name}
              className="h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}