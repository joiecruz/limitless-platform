import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

export default function Courses() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <div className="bg-[#40E0D0] py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Gain the Knowledge and Skills to Innovate with Confidence
              </h1>
            </div>
            <div className="space-y-4">
              <p className="text-gray-900 text-lg">
                Empower yourself and your team with the latest in innovation education and training. 
                Our courses are designed to equip you with practical tools and proven methodologies 
                that will help you develop 21st century skills while having fun.
              </p>
              <p className="text-gray-900 text-lg">
                Whether you prefer the hands-on experience of an in-person workshop or the 
                flexibility of online learning, we offer transformative courses to help you build the 
                skills and mindset for being an innovator and change agent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Training and Courses
          </h2>
          <p className="text-xl text-gray-600">
            Equip your team with the skills and mindset for innovation through engaging in-person workshops and flexible online courses.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}