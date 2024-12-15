import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AuthLinks = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-4 space-y-2">
      <p className="text-sm text-gray-600">
        Don't have an account?{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </Button>
      </p>
      <p className="text-sm text-gray-600">
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
          onClick={() => navigate("/reset-password")}
        >
          Forgot password?
        </Button>
      </p>
    </div>
  );
};