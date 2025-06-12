
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();

  const { data: course, isLoading } = useQuery({
    queryKey: ["public-course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) {
        console.error("Error fetching course:", error);
        throw error;
      }

      return data;
    },
    enabled: !!courseId,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["course-lessons", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data, error } = await supabase
        .from("lessons")
        .select("id, title, description, duration, order")
        .eq("course_id", courseId)
        .order("order");

      if (error) {
        console.error("Error fetching lessons:", error);
        throw error;
      }

      return data;
    },
    enabled: !!courseId,
  });

  const { data: enrollmentCount } = useQuery({
    queryKey: ["course-enrollment-count", courseId],
    queryFn: async () => {
      if (!courseId) return 0;

      const { count, error } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching enrollment count:", error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!courseId,
  });

  // Set the page title
  usePageTitle(course ? `${course.title} | Limitless Lab` : "Course | Limitless Lab");

  const totalDuration = lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);

  const handleEnrollClick = () => {
    toast({
      title: "Enrollment Coming Soon",
      description: "Course enrollment will be available soon. Sign up for our newsletter to be notified!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#393CA0]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist or is no longer available.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title={`${course.title} | Limitless Lab`}
        description={course.description}
        imageUrl={course.image_url || "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"}
        url={`${window.location.origin}/courses/${courseId}`}
        type="website"
      />

      <MainNav />

      {/* Hero Section */}
      <div className="bg-[#40E0D0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-gray-900 mb-8">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900">{lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900">{Math.ceil(totalDuration / 60)} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900">{enrollmentCount} enrolled</span>
                </div>
              </div>
              <Button 
                size="lg"
                onClick={handleEnrollClick}
                className="bg-[#393CA0] hover:bg-[#393CA0]/90 text-white px-8"
              >
                Enroll Now
              </Button>
            </div>
            {course.image_url && (
              <div className="relative">
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
            <div className="bg-gray-50 rounded-lg p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#393CA0] text-white text-sm font-semibold px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                      </div>
                      {lesson.description && (
                        <p className="text-gray-600 mb-3">{lesson.description}</p>
                      )}
                    </div>
                    {lesson.duration && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 ml-4">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration} min</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-[#393CA0] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-100 mb-6">
              Join {enrollmentCount} other learners and start your journey today.
            </p>
            <Button 
              size="lg"
              onClick={handleEnrollClick}
              className="bg-white text-[#393CA0] hover:bg-gray-100 px-8"
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
