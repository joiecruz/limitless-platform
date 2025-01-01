import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  body: string;
  photo_url?: string;
  type?: string;
}

export function TestimonialsSection() {
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('type', 'course')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
      }
      
      return data as Testimonial[];
    },
  });

  if (!testimonials?.length) {
    return null;
  }

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          What Our Students Say
        </h2>
        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white p-8 rounded-lg shadow-sm relative mt-8">
                    <div className="absolute -top-6 left-8">
                      <div className="bg-[#393CA0] rounded-full p-2">
                        <Quote className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <blockquote className="flex-grow">
                      <p className="text-gray-600 italic mb-6">
                        "{testimonial.body}"
                      </p>
                      <footer className="mt-auto">
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {testimonial.role}
                        </p>
                      </footer>
                    </blockquote>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-[#393CA0] text-[#393CA0] hover:bg-[#393CA0] hover:text-white -left-6" />
            <CarouselNext className="border-[#393CA0] text-[#393CA0] hover:bg-[#393CA0] hover:text-white -right-6" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}