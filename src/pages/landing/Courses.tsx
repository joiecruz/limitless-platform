
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TestimonialsSection } from "@/components/site-config/TestimonialsSection";
import { WorkshopsSection } from "@/components/site-config/WorkshopsSection";
import { CTASection } from "@/components/site-config/CTASection";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Courses() {
  const { toast } = useToast();
  
  // Set the page title
  usePageTitle("Courses & Learning | Limitless Lab");

  const { data: courses } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .in('format', ['Online', 'Hybrid'])
        .limit(3);
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
      
      return data;
    },
  });

  // Fetch enrollments for authenticated user
  const { data: enrollments } = useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session?.user?.id) return [];

      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id, progress')
        .eq('user_id', userSession.session.user.id);
      
      if (error) {
        console.error('Error fetching enrollments:', error);
        return [];
      }
      
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title="Courses & Learning | Limitless Lab"
        description="Gain the knowledge and skills to innovate with confidence through our transformative courses and workshops."
        imageUrl="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
        url={`${window.location.origin}/courses`}
        type="website"
      />
      
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
            {courses?.map((course) => {
              const enrollment = enrollments?.find((e) => e.course_id === course.id);
              
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrollment={enrollment}
                  onEnroll={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Course enrollment will be available soon.",
                    });
                  }}
                  isEnrolling={false}
                />
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Workshops Section */}
      <WorkshopsSection />
      
      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
