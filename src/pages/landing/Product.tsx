import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";

export default function Product() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Track impact, align with the SDGs, and achieve your goals
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Make data-driven decisions using our impact measurement tools. Monitor the success of your innovation projects and align them with the Sustainable Development Goals (SDGs).
              </p>
              <p className="text-xl text-gray-600">
                Whether you're a corporate innovator, a small business, or a government entity, our tools help you quantify your contributions and track your impact.
              </p>
            </div>
            <div>
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/product_page/Product.png"
                alt="Impact Dashboard"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Creativity Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Boost your team's creativity with a simpler innovation journey
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Create and implement new ideas faster and better with our guided and structured innovation workflows designed for corporate teams, SMEs, and government innovators.
              </p>
              <p className="text-xl text-gray-600">
                Our platform simplifies the process from user research, ideation, to implementation, ensuring that every idea has the best chance to thrive.
              </p>
            </div>
            <div>
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/product_page/Product-Empathize.png"
                alt="Innovation Journey"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Leverage both the power of design thinking and AI
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Blend creativity and AI to create meaningful solutions.
              </p>
              <p className="text-xl text-gray-600">
                Limitless Lab helps you uncover opportunities, refine ideas, and turn them into impactful results with ease.
              </p>
            </div>
            <div>
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/product_page/Screenshot_2024-11-15_at_2.36.42_PM.png"
                alt="AI Integration"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Start innovating for
          </h2>
          <p className="text-5xl font-bold text-[#40E0D0] mb-8">
            impact today
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="text-primary-700 bg-white hover:bg-gray-100"
          >
            Register for free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}