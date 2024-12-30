import { useParams } from "react-router-dom";

export default function CourseLessons() {
  const { courseId } = useParams();
  
  return (
    <div>
      <h1>Lessons for Course {courseId}</h1>
      {/* Course lessons content will be implemented later */}
    </div>
  );
}