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

  return (
    <div className="w-full overflow-hidden bg-transparent py-8">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        loop={true}
        speed={3000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: direction === "right"
        }}
        spaceBetween={32}
        className="!flex items-center"
      >
        {logos.map((logo) => (
          <SwiperSlide key={logo.id} className="!w-auto">
            <img
              src={logo.image_url}
              alt={logo.name}
              className="h-12 w-auto object-contain"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}