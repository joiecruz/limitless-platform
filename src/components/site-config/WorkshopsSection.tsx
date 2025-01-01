import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "@/components/courses/CourseCard";

export function WorkshopsSection() {
  const { data: courses } = useQuery({
    queryKey: ["in-person-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('format', 'In-Person');
      
      if (error) {
        console.error('Error fetching courses:', error);
        return [];
      }
      
      return data;
    },
  });

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Immersive In-Person Workshops
          </h2>
          <p className="text-xl text-gray-600">
            Hands-on learning, tangible outcomes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={() => {}}
              isEnrolling={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}