import { useClientLogos } from "./hooks/useClientLogos";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

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

  // Triple the logos array to ensure smooth infinite scrolling
  const tripledLogos = [...filteredLogos, ...filteredLogos, ...filteredLogos];

  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        loop={true}
        speed={20000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: direction === "right",
          pauseOnMouseEnter: false
        }}
        spaceBetween={48}
        className="!flex items-center"
        allowTouchMove={false}
      >
        {tripledLogos.map((logo, index) => (
          <SwiperSlide key={`${logo.id}-${index}`} className="!w-auto">
            <img
              src={logo.image_url}
              alt={logo.name}
              className="h-16 w-auto object-contain"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}