
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const AuthLinks = () => {
  const navigate = useNavigate();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  
  // Get email from the input field
  const getEmailFromForm = (): string => {
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    return emailInput?.value || '';
  };

  if (showPasswordReset) {
    return <ForgotPasswordForm 
      onCancel={() => setShowPasswordReset(false)}
      initialEmail={getEmailFromForm()}
    />;
  }

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
          onClick={() => setShowPasswordReset(true)}
        >
          Forgot password?
        </Button>
      </p>
    </div>
  );
};
