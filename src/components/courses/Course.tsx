import { useParams } from "react-router-dom";

export default function Course() {
  const { courseId } = useParams();
  
  return (
    <div>
      <h1>Course {courseId}</h1>
      {/* Course content will be implemented later */}
    </div>
  );
}