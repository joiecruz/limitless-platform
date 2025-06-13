
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("CourseDetail: courseId from params:", courseId);

  const { data: course, isLoading } = useQuery({
    queryKey: ["public-course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      console.log("Fetching course with ID:", courseId);

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) {
        console.error("Error fetching course:", error);
        throw error;
      }

      console.log("Course data:", data);
      return data;
    },
    enabled: !!courseId,
  });

  // Fetch lessons with better error handling
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["course-lessons", courseId],
    queryFn: async () => {
      if (!courseId) {
        console.log("No courseId provided for lessons query");
        return [];
      }

      console.log("Fetching lessons for course:", courseId);

      const { data, error } = await supabase
        .from("lessons")
        .select("id, title, description, duration, order")
        .eq("course_id", courseId)
        .order("order");

      if (error) {
        console.error("Error fetching lessons:", error);
        // Don't throw, return empty array to show empty state
        return [];
      }

      console.log("Lessons data:", data);
      return data || [];
    },
    enabled: !!courseId,
  });

  // Fetch real-time enrollment count
  const { data: enrollmentCount = 0, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["course-enrollment-count", courseId],
    queryFn: async () => {
      if (!courseId) {
        console.log("No courseId provided for enrollment count");
        return 0;
      }

      console.log("Fetching enrollment count for course:", courseId);

      const { count, error } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching enrollment count:", error);
        return 0;
      }

      console.log("Enrollment count:", count);
      return count || 0;
    },
    enabled: !!courseId,
    refetchOnWindowFocus: true,
  });

  // Check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Set the page title
  usePageTitle(course ? `${course.title} | Limitless Lab` : "Course | Limitless Lab");

  // Calculate totals from actual lesson data
  const totalDuration = lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
  const totalHours = Math.ceil(totalDuration / 60);
  const lessonCount = lessons.length;

  console.log("Calculated stats:", {
    lessonCount,
    totalDuration,
    totalHours,
    enrollmentCount
  });

  const handleEnrollClick = () => {
    if (!session) {
      // Redirect to signup if not authenticated
      navigate('/signup');
      return;
    }

    toast({
      title: "Enrollment Coming Soon",
      description: "Course enrollment will be available soon. Sign up for our newsletter to be notified!",
    });
  };

  if (isLoading || lessonsLoading || enrollmentLoading) {
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

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
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

      {/* Course Header with proper top padding */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Course Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-black leading-tight">
              {course.title}
            </h1>
          </div>

          {/* Course Image */}
          {course.image_url && (
            <div className="mb-12 flex justify-center">
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full max-w-2xl rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Course Stats - Using real-time data */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">{lessonCount} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">{totalHours} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">{enrollmentCount} enrolled</span>
            </div>
          </div>

          {/* Course Description */}
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {course.description}
            </p>
          </div>

          {/* Enroll Button */}
          <div className="text-center mb-16">
            <Button 
              size="lg"
              onClick={handleEnrollClick}
              className="bg-[#393CA0] hover:bg-[#393CA0]/90 text-white px-8"
            >
              {session ? "Enroll Now" : "Sign Up to Enroll"}
            </Button>
          </div>

          {/* What You'll Learn */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What You'll Learn</h2>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {/* Course Curriculum - Always show lessons with proper styling */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Course Curriculum</h2>
            {lessonCount > 0 ? (
              <div className="space-y-4 max-w-3xl mx-auto">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-white border border-gray-200 rounded-lg p-6 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-gray-400 text-white text-sm font-semibold px-2 py-1 rounded">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-600">{lesson.title}</h3>
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        {lesson.description && (
                          <p className="text-gray-500 mb-3">{lesson.description}</p>
                        )}
                      </div>
                      {lesson.duration && (
                        <div className="flex items-center gap-1 text-sm text-gray-400 ml-4">
                          <Clock className="h-4 w-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Course curriculum is being prepared. Check back soon!</p>
              </div>
            )}
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
              {session ? "Enroll Now" : "Sign Up to Enroll"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
