import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { NoIndex } from "@/components/common/NoIndex";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <NoIndex />
      <div className="w-full max-w-md space-y-8">
        <AuthLogo />
        <ForgotPasswordForm
          initialEmail={initialEmail}
          onCancel={() => navigate("/signin")}
        />
        <p className="text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link to="/signin" className="text-primary font-semibold hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
