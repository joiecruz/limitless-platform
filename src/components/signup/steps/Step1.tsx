import { useState } from "react";
import { TextStep } from "./TextStep";
import { SignupData } from "../types";

interface Step1Props {
  formData: SignupData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
}

export const Step1 = ({ formData, handleInputChange, nextStep }: Step1Props) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <TextStep
      fields={[
        {
          name: "email",
          label: "Work Email",
          type: "email",
          placeholder: "you@company.com",
          required: true,
          containerClassName: "w-full",
          error: errors.email,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "••••••••",
          required: true,
          containerClassName: "w-full",
          error: errors.password,
        }
      ]}
      values={formData}
      onChange={handleInputChange}
      onNext={handleNext}
      fieldsContainerClassName="flex gap-4 flex-wrap"
    />
  );
};