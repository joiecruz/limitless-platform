
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TestimonialsSection } from "@/components/site-config/TestimonialsSection";
import { WorkshopsSection } from "@/components/site-config/WorkshopsSection";
import { CTASection } from "@/components/site-config/CTASection";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Set the page title
  usePageTitle("Courses & Learning | Limitless Lab");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      console.log("Fetching courses for landing page");
      
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .in('format', ['Online', 'Hybrid']);

      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive",
        });
        return [];
      }

      console.log("Raw courses data:", coursesData);

      // Get real-time counts for each course
      const coursesWithCounts = await Promise.all(
        coursesData.map(async (course) => {
          console.log(`Fetching counts for course ${course.id}: ${course.title}`);
          
          // Fetch enrollment count
          const { count: enrollmentCount, error: enrollmentError } = await supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("course_id", course.id);

          if (enrollmentError) {
            console.error(`Error fetching enrollment count for course ${course.id}:`, enrollmentError);
          }

          // Fetch lesson count
          const { count: lessonCount, error: lessonError } = await supabase
            .from("lessons")
            .select("*", { count: "exact", head: true })
            .eq("course_id", course.id);

          if (lessonError) {
            console.error(`Error fetching lesson count for course ${course.id}:`, lessonError);
          }

          const courseWithCounts = {
            ...course,
            enrollee_count: enrollmentCount || 0,
            lesson_count: lessonCount || 0
          };

          console.log(`Course ${course.title} counts:`, {
            lessons: lessonCount,
            enrollments: enrollmentCount
          });

          return courseWithCounts;
        })
      );

      console.log("Final courses with counts:", coursesWithCounts);
      return coursesWithCounts;
    },
    staleTime: 1000 * 60, // Cache for 1 minute
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#393CA0]"></div>
        </div>
        <Footer />
      </div>
    );
  }

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
            {courses?.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {course.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lesson_count} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollee_count} enrolled</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="flex-1 bg-[#393CA0] hover:bg-[#393CA0]/90"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
