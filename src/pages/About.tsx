import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Hello!<br />
                We are Limitless Lab
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Limitless Lab is a global social innovation company that uses creativity, design, and technology to drive positive change.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We collaborate with diverse stakeholders in building innovation capability of people, co-designing impactful solutions, and launching products and tools for changemakers and social innovators.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/About%20photo.png"
                alt="Limitless Lab Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}