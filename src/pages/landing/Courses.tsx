import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { BookOpen, Clock, Award } from "lucide-react";

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

      {/* Course Preview Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Transformative Online Courses and Programs
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Flexible learning experiences for continuous learning and development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="aspect-video bg-gray-100" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Certified Social Innovation Facilitator Program™
                </h3>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>12 lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>30 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Certificate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="aspect-video bg-gray-100" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Design Thinking for Social Innovation
                </h3>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>5 lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>2 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Certificate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="aspect-video bg-gray-100" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  LimitlessGov: Human-Centered and AI-Powered Good Governance
                </h3>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>12 lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>30 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Certificate</span>
                  </div>
                </div>
              </div>
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