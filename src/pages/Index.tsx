import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { InfiniteLogos } from "@/components/site-config/InfiniteLogos";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              The all-in-one platform<br />
              empowering innovators to turn<br />
              ideas into real impact
            </h1>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/signup")}
                className="px-8 bg-primary hover:bg-primary/90 transition-colors duration-200"
              >
                Create account
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/services")}
                className="px-8 text-primary border-primary hover:bg-primary/5 transition-colors duration-200"
              >
                Explore services
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <img 
              src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png?t=2024-12-29T12%3A51%3A15.539Z"
              alt="Limitless Lab Platform"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Logo Sections */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Client Logos */}
            <div>
              <h2 className="text-center text-2xl font-semibold text-gray-900 mb-8">
                Join the growing network of organizations innovating for social good
              </h2>
              <InfiniteLogos direction="left" />
            </div>

            {/* User Logos */}
            <div>
              <h2 className="text-center text-lg font-semibold text-gray-600 mb-8">
                Empowering innovators worldwide
              </h2>
              <InfiniteLogos direction="right" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {/* Product Feature */}
            <div className="flex items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1 rounded-full text-sm bg-blue-50 text-blue-600">
                  Product
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Innovation Management Platform</h2>
                <p className="text-lg text-gray-600">
                  Streamline your innovation process with our AI-powered platform designed to support every stage—from user research, ideation to impact measurement.
                </p>
                <p className="text-lg text-gray-600">
                  Empower your team with tools that make collaboration easier, faster, and more effective.
                </p>
                <Button 
                  onClick={() => navigate("/product")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Learn more
                </Button>
              </div>
              <div className="flex-1">
                <img 
                  src="/lovable-uploads/b1780df7-6290-468d-86f3-f6ecca36a256.png"
                  alt="Innovation Management Platform"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            {/* Services Feature */}
            <div className="flex items-center gap-16">
              <div className="flex-1">
                <img 
                  src="/lovable-uploads/ecaeaac6-0275-473b-972a-fea6eb8d9cee.png"
                  alt="Custom Co-design Services"
                  className="w-full rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1 rounded-full text-sm bg-green-50 text-green-600">
                  Services
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Custom Co-design Services</h2>
                <p className="text-lg text-gray-600">
                  Bring your vision to life with our collaborative co-design services.
                </p>
                <p className="text-lg text-gray-600">
                  We work alongside your team and key stakeholders to tackle unique challenges, creating tailored solutions that reflect diverse perspectives, align with your organization's goals, and drive meaningful impact.
                </p>
                <Button 
                  onClick={() => navigate("/services")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Explore services
                </Button>
              </div>
            </div>

            {/* Tools Feature */}
            <div className="flex items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1 rounded-full text-sm bg-yellow-50 text-yellow-600">
                  Tools
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Tools and Resources</h2>
                <p className="text-lg text-gray-600">
                  Jumpstart your innovation projects with our collection of ready-to-use worksheets, templates, and frameworks.
                </p>
                <p className="text-lg text-gray-600">
                  These tools are designed to simplify complex processes and guide your team toward effective solutions, every step of the way.
                </p>
                <Button 
                  onClick={() => navigate("/tools")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Access tools
                </Button>
              </div>
              <div className="flex-1">
                <img 
                  src="/lovable-uploads/20a108f1-df5f-4fd5-81e5-84b3205db3f5.png"
                  alt="Tools and Resources"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            {/* Training Feature */}
            <div className="flex items-center gap-16">
              <div className="flex-1">
                <img 
                  src="/lovable-uploads/d300859d-8a3d-4e67-b3fa-ac375bf0b6f2.png"
                  alt="In-Person Training and Online Courses"
                  className="w-full rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1 rounded-full text-sm bg-pink-50 text-pink-600">
                  Training
                </div>
                <h2 className="text-4xl font-bold text-gray-900">In-Person Training and Online Courses</h2>
                <p className="text-lg text-gray-600">
                  Equip your team with the skills and mindset for innovation.
                </p>
                <p className="text-lg text-gray-600">
                  Through engaging in-person workshops and flexible online courses, we provide hands-on learning experiences that drive real change and empower continuous growth.
                </p>
                <Button 
                  onClick={() => navigate("/courses")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse courses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
