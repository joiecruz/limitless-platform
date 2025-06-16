
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function WorkshopDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("WorkshopDetail: courseId from params:", courseId);

  const { data: course, isLoading } = useQuery({
    queryKey: ["public-workshop", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      console.log("Fetching workshop with ID:", courseId);

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .eq("format", "In-Person")
        .single();

      if (error) {
        console.error("Error fetching workshop:", error);
        throw error;
      }

      console.log("Workshop data:", data);
      return data;
    },
    enabled: !!courseId,
  });

  // Fetch real-time enrollment count
  const { data: enrollmentCount = 0, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["workshop-enrollment-count", courseId],
    queryFn: async () => {
      if (!courseId) {
        console.log("No courseId provided for enrollment count");
        return 0;
      }

      console.log("Fetching enrollment count for workshop:", courseId);

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
  usePageTitle(course ? `${course.title} | Limitless Lab` : "Workshop | Limitless Lab");

  const handleBookingClick = () => {
    if (course?.booking_link) {
      window.open(course.booking_link, '_blank');
    } else {
      if (!session) {
        // Redirect to signup if not authenticated
        navigate('/signup');
        return;
      }

      toast({
        title: "Booking Coming Soon",
        description: "Workshop booking will be available soon. Sign up for our newsletter to be notified!",
      });
    }
  };

  // Parse learning outcomes - handle both array and string formats
  const learningOutcomes = course?.learning_outcomes 
    ? Array.isArray(course.learning_outcomes) 
      ? course.learning_outcomes 
      : course.learning_outcomes.split('\n').filter(outcome => outcome.trim())
    : [];

  // Parse curriculum text into bullet points
  const curriculumPoints = course?.course_curriculum_text 
    ? course.course_curriculum_text.split('\n').filter(point => point.trim())
    : [];

  if (isLoading || enrollmentLoading) {
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Workshop Not Found</h1>
            <p className="text-gray-600">The workshop you're looking for doesn't exist or is no longer available.</p>
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
        url={`${window.location.origin}/workshops/${courseId}`}
        type="website"
      />

      <MainNav />

      {/* Workshop Header with proper top padding */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Workshop Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-black leading-tight">
              {course.title}
            </h1>
          </div>

          {/* Workshop Image */}
          {course.image_url && (
            <div className="mb-12 flex justify-center">
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full max-w-2xl rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Workshop Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">In-Person Workshop</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">{enrollmentCount} registered</span>
            </div>
          </div>

          {/* Workshop Description */}
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {course.description}
            </p>
          </div>

          {/* Booking Button */}
          <div className="text-center mb-16">
            <Button 
              size="lg"
              onClick={handleBookingClick}
              className="bg-[#393CA0] hover:bg-[#393CA0]/90 text-white px-8"
            >
              Book Exploratory Call
            </Button>
          </div>

          {/* Who is this for */}
          {course.who_is_this_for && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Who Is This For?</h2>
              <div className="bg-gray-50 rounded-lg p-8">
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto text-center">
                  {course.who_is_this_for}
                </p>
              </div>
            </div>
          )}

          {/* What You'll Learn - Using Learning Outcomes */}
          {learningOutcomes.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What You'll Learn</h2>
              <div className="bg-gray-50 rounded-lg p-8">
                <ul className="space-y-4 max-w-3xl mx-auto">
                  {learningOutcomes.map((outcome, index) => {
                    const shouldShowCheck = !outcome.toLowerCase().startsWith('by the end');
                    return (
                      <li key={index} className="flex items-start gap-3">
                        {shouldShowCheck && (
                          <CheckCircle className="h-6 w-6 text-[#393CA0] mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-lg text-gray-700 ${!shouldShowCheck ? 'ml-9' : ''}`}>
                          {outcome}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Course Curriculum - Bulleted list */}
          {curriculumPoints.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Workshop Curriculum</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <ul className="space-y-3 max-w-3xl mx-auto">
                  {curriculumPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#393CA0] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-[#393CA0] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Bring This Learning Experience to Your Team</h2>
            <p className="text-gray-100 mb-6">
              Ready to empower your organization with cutting-edge innovation skills? Let's discuss how this workshop can transform your team's approach to problem-solving and innovation.
            </p>
            <Button 
              size="lg"
              onClick={handleBookingClick}
              className="bg-white text-[#393CA0] hover:bg-gray-100 px-8"
            >
              Book Exploratory Call
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
