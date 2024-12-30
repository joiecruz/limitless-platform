import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  quote: string;
  author: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "The courses have transformed how I approach innovation. The practical tools and frameworks are invaluable.",
    author: "Sarah Johnson",
    company: "Tech Innovators Inc."
  },
  {
    quote: "The hybrid learning format perfectly balanced flexibility with hands-on practice. Highly recommended!",
    author: "Michael Chen",
    company: "Future Labs"
  },
  {
    quote: "This program helped me develop practical innovation skills I use every day in my role.",
    author: "Emma Rodriguez",
    company: "Global Solutions"
  },
  {
    quote: "The online courses exceeded my expectations. The content is engaging and immediately applicable.",
    author: "David Park",
    company: "Innovation Hub"
  },
  {
    quote: "A game-changing learning experience that has accelerated my professional growth.",
    author: "Lisa Thompson",
    company: "Digital Ventures"
  }
];

export function TestimonialsSection() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
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
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white p-6 rounded-lg shadow-sm relative h-full">
                    <div className="absolute -top-4 left-6">
                      <div className="bg-[#393CA0] rounded-full p-2">
                        <Quote className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <blockquote className="mt-4">
                      <p className="text-gray-600 italic mb-4">
                        "{testimonial.quote}"
                      </p>
                      <footer>
                        <p className="font-semibold text-gray-900">
                          {testimonial.author}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {testimonial.company}
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