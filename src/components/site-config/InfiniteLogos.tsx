import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Logo {
  id: string;
  name: string;
  image_url: string;
}

export function InfiniteLogos({ direction = "left" }: { direction?: "left" | "right" }) {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    async function fetchLogos() {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching logos:', error);
        return;
      }
      
      setLogos(data || []);
    }

    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

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
          width: "fit-content", // Add this to ensure proper scrolling
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