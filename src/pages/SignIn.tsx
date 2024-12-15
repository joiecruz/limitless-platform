import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SignInForm } from "@/components/signin/SignInForm";
import { SignInHeader } from "@/components/signin/SignInHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function SignIn() {
  const navigate = useNavigate();
  useAuthRedirect();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignInHeader />
        
        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          <SignInForm />
          
          {/* Sign Up Link */}
          <div className="text-center mt-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}