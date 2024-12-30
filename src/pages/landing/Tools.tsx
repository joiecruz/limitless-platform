import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

export default function Tools() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Innovation Tools and Resources
          </h1>
          <p className="text-xl text-gray-600">
            Jumpstart your innovation projects with our collection of ready-to-use worksheets, templates, and frameworks.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}