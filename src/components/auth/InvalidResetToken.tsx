
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export function InvalidResetToken() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center text-red-500">
      <p>Invalid or expired reset link. Please request a new password reset.</p>
      <Button 
        className="mt-4 w-full"
        onClick={() => navigate('/signin')}
        style={{ backgroundColor: "rgb(69, 66, 158)" }}
      >
        Back to sign in
      </Button>
    </div>
  );
}
