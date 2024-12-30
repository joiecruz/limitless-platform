import { useClientLogos } from "./hooks/useClientLogos";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface InfiniteLogosProps {
  direction?: "left" | "right";
}

export function InfiniteLogos({ direction = "left" }: InfiniteLogosProps) {
  const { data: logos, isLoading } = useClientLogos();

  if (isLoading || !logos) {
    return null;
  }

  // Double the logos array to ensure smooth infinite scrolling
  const doubledLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        loop={true}
        speed={15000}
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
        {doubledLogos.map((logo, index) => (
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