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
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        loop={true}
        speed={8000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: direction === "right",
          pauseOnMouseEnter: false
        }}
        spaceBetween={24}
        className="!flex items-center"
        allowTouchMove={false}
      >
        {logos.map((logo) => (
          <SwiperSlide key={logo.id} className="!w-auto">
            <img
              src={logo.image_url}
              alt={logo.name}
              className="h-10 w-auto object-contain grayscale opacity-70"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}