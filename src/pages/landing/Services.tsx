import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Custom Co-design Services
          </h1>
          <p className="text-xl text-gray-600">
            Bring your vision to life with our collaborative co-design services. We work alongside your team and key stakeholders to tackle unique challenges.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}