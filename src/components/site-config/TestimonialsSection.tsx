import { Quote } from "lucide-react";

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
  }
];

export function TestimonialsSection() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm relative"
            >
              <div className="absolute -top-4 left-6">
                <div className="bg-primary-600 rounded-full p-2">
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
          ))}
        </div>
      </div>
    </div>
  );
}