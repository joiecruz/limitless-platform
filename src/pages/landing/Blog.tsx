import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { BlogSection } from "@/components/site-config/BlogSection";

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Blog & Updates
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Explore the latest trends, expert insights, and transformative ideas at the intersection of innovation and social change.
          </p>
          <BlogSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}