import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Learning Platform</h1>
        <p className="text-xl text-gray-600 mb-8">Start your learning journey today!</p>
        <Button onClick={() => navigate("/courses")}>
          View Courses
        </Button>
      </div>
    </div>
  );
};

export default Home;