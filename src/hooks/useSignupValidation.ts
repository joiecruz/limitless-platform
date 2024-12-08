import { SignupData } from "@/components/signup/types";

export function useSignupValidation() {
  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /[a-z]/, message: "one lowercase character" },
      { regex: /[A-Z]/, message: "one uppercase character" },
      { regex: /\d/, message: "one number" },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "one special character" },
      { regex: /.{8,}/, message: "8 characters minimum" },
    ];

    const failedRequirements = requirements.filter(req => !req.regex.test(password));
    return failedRequirements.length === 0 ? "" : `Password must contain ${failedRequirements.map(r => r.message).join(", ")}`;
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
    return "";
  };

  const isFormValid = (formData: SignupData) => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    return !emailError && !passwordError;
  };

  return {
    validatePassword,
    validateEmail,
    isFormValid,
  };
}